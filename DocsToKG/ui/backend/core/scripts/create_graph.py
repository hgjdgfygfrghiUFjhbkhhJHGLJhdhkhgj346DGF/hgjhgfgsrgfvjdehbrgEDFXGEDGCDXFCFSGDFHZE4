from neo4j_api import *
import argparse
from llm_graph_builder_api import *
import os

def parse_args():
    parser = argparse.ArgumentParser(
        description="Create Lexical Graph in Neo4j"
    )

    parser.add_argument(
        "--uri",
        required=True
    )

    parser.add_argument(
        "--username",
        required=True,
    )

    parser.add_argument(
        "--password",
        required=True
    )

    parser.add_argument(
        "--database",
        required=True
    )

    parser.add_argument(
        "--aura-ds",
        required=True,
        type=bool
    )

    parser.add_argument(
        "--hierarchy-path",
        required=True
    )

    parser.add_argument(
        "--shrinks-path",
        required=True
    )

    parser.add_argument(
        "--embedding-provider",
        required=True
    )

    parser.add_argument(
        "--embedding-model",
        required=True
    )

    parser.add_argument(
        "--llm-provider",
        required=True
    )

    parser.add_argument(
        "--llm-model",
        required=True
    )

    parser.add_argument(
        "--similarity-metric",
        required=True
    )

    parser.add_argument(
        "--separator",
        required=True
    )

    parser.add_argument(
        "--chunk-size",
        required=True
    )

    parser.add_argument(
        "--chunk-overlap",
        required=True
    )

    parser.add_argument(
        "--vector-dim",
        required=True
    )

    parser.add_argument(
        "--level-labels",
        nargs="+",
        default=["H1", "H2", "H3", "H4", "H5", "H6"]
    )

    parser.add_argument(
        "--meta-label",
        default="LexicalGraph"
    )

    parser.add_argument(
        "--llmgb-url"
    )

    parser.add_argument(
        "--allowed-nodes",
        nargs="+",
        required=False
    )

    parser.add_argument(
        "--allowed-relationships",
        nargs="+",
        required=False
    )

    parser.add_argument(
        "--additional-instructions",
        required=False,
    )


    parser.add_argument(
        "--meta-label",
        default="LexicalGraph"
    )
    

    return parser.parse_args()

def main():
    args = parse_args()

    instance = Neo4jAPI(
        uri=args.uri,
        user=args.username,
        password=args.password,
        database=args.database,
        aura_ds=args.aura_ds.lower() == 'true'
    )

    embedding_provider = {
        "provider": args.embedding_provider,
        "model_name": args.embedding_model
    }

    llm = {
        "provider": args.llm_provider,
        "model_name": args.llm_model
    }

    instance.create_lexical_graph(
        folder_path=args.hierarchy_path,
        embedding_provider=embedding_provider,
        llm=llm,
        vector_sim_func=args.similarity_metric,
        separator=args.separator,
        chunk_size=int(args.chunk_size),
        chunk_overlap=int(args.chunk_overlap),
        vector_dimensions=int(args.vector_dim),
        level_labels=args.level_labels,
        meta_label=args.meta_label
    )

    llm_graph_builder = LLMGraphBuilderAPI(
        username=args.username,
        password=args.password,
        database=args.database,
        url=args.llmgb_url,
        neo4j_uri=args.uri,
        aura_ds=args.aura_ds.lower() == 'true'
    )

    for filename in os.listdir(args.shrinks_path):
        file_path = os.path.join(args.shrinks_path, filename)
        llm_graph_builder.upload_file(file_path)
        llm_graph_builder.generate_graph(file_name=os.path.basename(file_path),
                                         model=f"{args.llm_provider}_{args.llm_model}",
                                         allowed_nodes=args.allowed_nodes,
                                         allowed_relationships=args.allowed_relationships,
                                         additional_instructions=args.additional_instructions,
                                         meta_label=args.meta_label,
                                         token_chunk_size=args.chunk_size,
                                         token_chunk_overlap=args.chunk_overlap
                                         )
    

    


if __name__ == "__main__":
    main()

# NEO4J_URI="neo4j+s://0e0b1a48.databases.neo4j.io"
# NEO4J_USERNAME="neo4j"
# NEO4J_PASSWORD="WwO7UslE8DzciMfGWIM4qkcp3scqb4j-ZtuGL_RMyo0"
# NEO4J_DATABASE="neo4j"
# AURA_INSTANCEID="0e0b1a48"
# AURA_INSTANCENAME="Instance03"
# instance = Neo4jAPI(NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD, NEO4J_DATABASE, aura_ds=True)

# instance.create_lexical_graph("../results/hierarchy/hierarchy_sample_1", embedding_provider={"provider": "ollama", "model_name": "llama3.1:latest"}, llm={"provider": "ollama", "model_name": "llama3.1:latest"})
