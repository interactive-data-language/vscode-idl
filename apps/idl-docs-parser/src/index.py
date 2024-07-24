from llama_index.core import SimpleDirectoryReader, StorageContext, VectorStoreIndex
from llama_index.core import set_global_tokenizer, load_index_from_storage,
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.llama_cpp import LlamaCPP
from llama_index.llms.llama_cpp.llama_utils import (
    messages_to_prompt,
    completion_to_prompt,
)
from transformers import AutoTokenizer


"""
References:

Save/restore/create index
https://docs.llamaindex.ai/en/stable/examples/vector_stores/SimpleIndexDemo/

Custom model that runs locally:
https://docs.llamaindex.ai/en/stable/examples/llm/llama_2_llama_cpp/
"""


# set the global tokenizer
set_global_tokenizer(
    AutoTokenizer.from_pretrained("NousResearch/Llama-2-7b-chat-hf").encode
)


def CreateIndex(source, index_id, destination, embed_model=None):
  """
  Create new index and persist it to disk

  Optionally specify the model to use for creating embeddings.

  Comes from: https://docs.llamaindex.ai/en/stable/examples/llm/llama_2_llama_cpp/
  """
  # load documents
  documents = SimpleDirectoryReader(source).load_data()
  index = VectorStoreIndex.from_documents(documents, embed_model=embed_model)

  # save index to disk
  index.set_index_id(index_id)
  index.storage_context.persist(destination)
  
  # return!
  return index


def LoadIndex(path, index_id)
  """
  Load an index from disk

  TODO: is there anything to add for the embed model from above
  """
  # rebuild storage context
  storage_context = StorageContext.from_defaults(persist_dir=path)

  # load index
  return load_index_from_storage(storage_context, index_id=index_id)


# ID for our index (from examples)
INDEX_ID = "vector_index"

# create the model we use to create embeddings
embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

# create our index
index = CreateIndex("./data/paul_graham/", INDEX_ID, "./storage", embed_model=embed_model)

# load our search index from disk
# index = LoadIndex("./storage", INDEX_ID)

# URL for the model we use
model_url = "https://huggingface.co/TheBloke/Llama-2-13B-chat-GGML/resolve/main/llama-2-13b-chat.ggmlv3.q4_0.bin"

# create our LLM
llm = LlamaCPP(
    # You can pass in the URL to a GGML model to download it automatically
    model_url=model_url,
    # optionally, you can set the path to a pre-downloaded model instead of model_url
    model_path=None,
    temperature=0.1,
    max_new_tokens=256,
    # llama2 has a context window of 4096 tokens, but we set it lower to allow for some wiggle room
    context_window=3900,
    # kwargs to pass to __call__()
    generate_kwargs={},
    # kwargs to pass to __init__()
    # set to at least 1 to use GPU
    model_kwargs={"n_gpu_layers": 1},
    # transform inputs into Llama2 format
    messages_to_prompt=messages_to_prompt,
    completion_to_prompt=completion_to_prompt,
    verbose=True,
)

# set up query engine
query_engine = index.as_query_engine(llm=llm)

response = query_engine.query("What did the author do growing up?")
print(response)