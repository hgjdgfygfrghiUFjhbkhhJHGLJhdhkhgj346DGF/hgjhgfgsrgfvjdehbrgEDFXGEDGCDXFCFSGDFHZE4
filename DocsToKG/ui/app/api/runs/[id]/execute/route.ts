import { NextRequest, NextResponse } from 'next/server';
import { ensureSchema, getConnection } from '@/app/lib/db';
import { getUserFromToken } from '@/app/lib/auth';
import { RowDataPacket } from 'mysql2/promise';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await ensureSchema();
    const pool = await getConnection();

    const user = await getUserFromToken();
    if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const runId = parseInt(id, 10);
    if (isNaN(runId)) return NextResponse.json({ message: 'Invalid run id' }, { status: 400 });

    // Get active project
    const [projectRows] = await pool.query<RowDataPacket[]>(
      'SELECT project_name FROM Project WHERE user_id = ? AND is_active = 1 LIMIT 1',
      [user.user_id]
    );
    if (!projectRows || projectRows.length === 0) return NextResponse.json({ message: 'No active project found' }, { status: 404 });
    const projectName = (projectRows[0] as any).project_name;

    // Get storage settings
    const [settingRows] = await pool.query<RowDataPacket[]>(
      'SELECT raw_doc_path, metadata_doc_path, text_doc_path, formulas_doc_path, figures_doc_path, hierarchy_doc_path, shrinks_doc_path, raw_doc_prefix FROM Setting WHERE user_id = ? AND project_name = ?',
      [user.user_id, projectName]
    );

    if (!settingRows || settingRows.length === 0) {
      return NextResponse.json({ message: 'Settings not configured for active project' }, { status: 400 });
    }

    const s = settingRows[0] as any;

    const expand = (p: string | null) => {
      if (!p) return null;
      return p.startsWith('~') ? path.join(os.homedir(), p.slice(1)) : p;
    };

    const folderPath = expand(s.raw_doc_path) ? path.join(expand(s.raw_doc_path)!, String(runId)) : null;
    const metadataPath = expand(s.metadata_doc_path) || null;
    const textPath = expand(s.text_doc_path) || null;
    const formulasPath = expand(s.formulas_doc_path) || null;
    const figuresPath = expand(s.figures_doc_path) || null;
    const hierarchyPath = expand(s.hierarchy_doc_path) || null;
    const shrinksPath = expand(s.shrinks_doc_path) || null;

    // Read body for validTasks and noPipeline (noPipeline should be false by request)
    const body = await req.json().catch(() => ({}));
    const validTasks: string[] = Array.isArray(body.validTasks) ? body.validTasks : [];
    const noPipelineFlag: boolean = Boolean(body.noPipeline);

    if (!folderPath) return NextResponse.json({ message: 'Raw documents path not configured' }, { status: 400 });

    // Ensure all required output paths are configured
    const missingOutputs = [] as string[];
    if (!metadataPath) missingOutputs.push('metadata');
    if (!textPath) missingOutputs.push('text');
    if (!formulasPath) missingOutputs.push('formulas');
    if (!figuresPath) missingOutputs.push('figures');
    if (!hierarchyPath) missingOutputs.push('hierarchy');
    if (!shrinksPath) missingOutputs.push('shrinks');

    if (missingOutputs.length > 0) {
      return NextResponse.json({ message: 'Missing output paths in settings', missing: missingOutputs }, { status: 400 });
    }

    // Locate the Python script relative to this file
    const scriptPath = path.resolve(new URL(import.meta.url).pathname).replace('/app/api/runs/[id]/execute/route.ts', '/backend/core/scripts/extract_data.py');

    // Build arguments
    const args: string[] = [];
    args.push(scriptPath);
    args.push('--folder-path', folderPath);
    if (metadataPath) args.push('--metadata-path', metadataPath);
    if (textPath) args.push('--text-path', textPath);
    if (formulasPath) args.push('--formulas-path', formulasPath);
    if (figuresPath) args.push('--figures-path', figuresPath);
    if (hierarchyPath) args.push('--hierarchy-path', hierarchyPath);
    if (shrinksPath) args.push('--shrinks-path', shrinksPath);
    if (validTasks.length > 0) args.push('--valid-tasks', ...validTasks);
    // include --no-pipeline only when true (user requested disabling); per requirement it's False, so skip
    if (noPipelineFlag) args.push('--no-pipeline');

    // Spawn python process (detached so it can run independently)
    const python = process.env.PYTHON || 'python3';
    const child = spawn(python, args, {
      detached: true,
      stdio: 'ignore'
    });
    child.unref();

    console.log(`[EXTRACT] Started extractor for run ${runId} (pid=${child.pid})`);

    // Mark the run as executed
    try {
      await pool.query(`UPDATE Run SET is_executed = TRUE WHERE id = ?`, [runId]);
    } catch (updateErr) {
      console.error(`[EXTRACT] Failed to mark run ${runId} as executed:`, updateErr);
    }

    return NextResponse.json({ message: 'Extraction started', pid: child.pid, runId }, { status: 202 });
  } catch (err: any) {
    console.error('[API /api/runs/[id]/execute] Error:', err);
    return NextResponse.json({ message: 'Failed to start extraction', error: String(err) }, { status: 500 });
  }
}
