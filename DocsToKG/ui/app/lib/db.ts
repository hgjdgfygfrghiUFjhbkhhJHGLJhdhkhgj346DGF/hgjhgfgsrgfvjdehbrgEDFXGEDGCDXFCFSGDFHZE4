import mysql, { Pool } from "mysql2/promise";

const {
  DB_HOST = "localhost",
  DB_PORT = "3308",
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_POOL_SIZE = "5",
} = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD) {
  throw new Error("Missing DB_NAME, DB_USER, or DB_PASSWORD environment variables.");
}

let pool: Pool | null = null;
let schemaInitialized = false;

async function ensureDatabase(): Promise<void> {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await connection.end();
}

function getPool(): Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: DB_HOST,
      port: Number(DB_PORT),
      database: DB_NAME,
      user: DB_USER,
      password: DB_PASSWORD,
      waitForConnections: true,
      connectionLimit: Number(DB_POOL_SIZE),
      namedPlaceholders: true,
    });
  }
  return pool;
}

export async function ensureSchema(): Promise<void> {
  if (schemaInitialized) return;

  await ensureDatabase();
  const pool = getPool();

  const statements = [
    `CREATE TABLE IF NOT EXISTS User (
      user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
      first_name VARCHAR(255),
      last_name VARCHAR(255),
      birth_date DATE,
      email VARCHAR(320) UNIQUE,
      address VARCHAR(512),
      role ENUM('admin','member','user') DEFAULT 'user',
      password VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    `CREATE TABLE IF NOT EXISTS Project (
      project_name VARCHAR(255) NOT NULL,
      user_id BIGINT NOT NULL,
      description TEXT,
      is_favorite BOOLEAN DEFAULT FALSE,
      is_active BOOLEAN DEFAULT FALSE,
      status ENUM('uploading','processing','analyzing','error') DEFAULT 'uploading',
      tags TEXT,
      percentage INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (project_name, user_id),
      CONSTRAINT fk_project_user FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    `CREATE TABLE IF NOT EXISTS Document (
      doc_id BIGINT AUTO_INCREMENT,
      user_id BIGINT NOT NULL,
      project_name VARCHAR(255) NOT NULL,
      path_name VARCHAR(1024) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (doc_id, user_id, project_name),
      INDEX idx_document_project (project_name, user_id),
      CONSTRAINT fk_document_project FOREIGN KEY (project_name, user_id) REFERENCES Project(project_name, user_id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    `CREATE TABLE IF NOT EXISTS Setting (
      user_id BIGINT NOT NULL,
      project_name VARCHAR(255) NOT NULL,
      raw_doc_path VARCHAR(1024),
      raw_doc_prefix VARCHAR(255),
      metadata_doc_path VARCHAR(1024),
      metadata_doc_prefix VARCHAR(255),
      text_doc_path VARCHAR(1024),
      text_doc_prefix VARCHAR(255),
      figures_doc_path VARCHAR(1024),
      figures_doc_prefix VARCHAR(255),
      formulas_doc_path VARCHAR(1024),
      formulas_doc_prefix VARCHAR(255),
      tables_doc_path VARCHAR(1024),
      tables_doc_prefix VARCHAR(255),
      hierarchy_doc_path VARCHAR(1024),
      hierarchy_doc_prefix VARCHAR(255),
      shrinks_doc_path VARCHAR(1024),
      shrinks_doc_prefix VARCHAR(255),
      llm_provider VARCHAR(255),
      model VARCHAR(255),
      embedding_model VARCHAR(255),
      dimensions INT,
      similarity_metric VARCHAR(255),
      lexical_graph_meta_label VARCHAR(255),
      domain_graph_meta_label VARCHAR(255),
      formulas_graph_meta_label VARCHAR(255),
      tables_graph_meta_label VARCHAR(255),
      figures_graph_meta_label VARCHAR(255),
      hierarchy_level TEXT,
      llm_graph_builder_url VARCHAR(1024),
      neo_4j_uri VARCHAR(1024),
      neo4j_username VARCHAR(255),
      neo4j_password VARCHAR(255),
      neo4j_database VARCHAR(255),
      neo4j_auradb BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (project_name, user_id),
      CONSTRAINT fk_setting_project FOREIGN KEY (project_name, user_id) REFERENCES Project(project_name, user_id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
  ];

  for (const stmt of statements) {
    await pool.query(stmt);
  }

  // Ensure is_active exists on older databases (ignore if already present)
  try {
    await pool.query(`ALTER TABLE Project ADD COLUMN is_active BOOLEAN DEFAULT FALSE AFTER is_favorite`);
  } catch (err: any) {
    if (err?.code !== "ER_DUP_FIELDNAME") {
      throw err;
    }
  }

  // Ensure role exists on older databases (ignore if already present)
  try {
    await pool.query(`ALTER TABLE User ADD COLUMN role ENUM('admin','member','user') DEFAULT 'user' AFTER address`);
  } catch (err: any) {
    if (err?.code !== "ER_DUP_FIELDNAME") {
      throw err;
    }
  }

  schemaInitialized = true;
}

export async function getConnection() {
  await ensureSchema();
  return getPool();
}
