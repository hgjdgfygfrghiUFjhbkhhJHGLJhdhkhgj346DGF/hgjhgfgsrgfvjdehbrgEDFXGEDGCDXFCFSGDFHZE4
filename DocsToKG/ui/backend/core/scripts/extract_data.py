import argparse
from pathlib import Path
from doc_proc_extractor import DocProcExtractor


def parse_args():
    parser = argparse.ArgumentParser(
        description="Document Processing Extractor CLI"
    )

    parser.add_argument(
        "--folder-path",
        required=True,
        help="Path to the folder containing raw documents",
    )

    parser.add_argument(
        "--metadata-path",
        required=True,
        help="Output path for metadata results",
    )

    parser.add_argument(
        "--text-path",
        required=True,
        help="Output path for extracted text",
    )

    parser.add_argument(
        "--formulas-path",
        required=True,
        help="Output path for extracted formulas",
    )

    parser.add_argument(
        "--figures-path",
        required=True,
        help="Output path for extracted figures",
    )

    parser.add_argument(
        "--hierarchy-path",
        required=True,
        help="Output path for document hierarchy",
    )

    parser.add_argument(
        "--shrinks-path",
        required=True,
        help="Output path for shrinks",
    )

    parser.add_argument(
        "--valid-tasks",
        nargs="+",
        required=True,
        help="Tasks to execute (e.g. shrinks figures)",
    )

    parser.add_argument(
        "--no-pipeline",
        action="store_true",
        help="Disable pipeline execution",
    )

    return parser.parse_args()


def main():
    args = parse_args()

    output_structure = {
        "metadata": str(Path(args.metadata_path).resolve()),
        "text": str(Path(args.text_path).resolve()),
        "formulas": str(Path(args.formulas_path).resolve()),
        "figures": str(Path(args.figures_path).resolve()),
        "hierarchy": str(Path(args.hierarchy_path).resolve()),
        "shrinks": str(Path(args.shrinks_path).resolve()),
    }

    dpex = DocProcExtractor(
        folder_path=str(Path(args.folder_path).resolve()),
        output_structure=output_structure,
        apply_pipeline=not args.no_pipeline,
        valid_tasks=args.valid_tasks,
    )

    dpex.run()


if __name__ == "__main__":
    main()
