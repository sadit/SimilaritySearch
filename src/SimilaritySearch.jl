# This file is a part of SimilaritySearch.jl
# License is Apache 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

module SimilaritySearch
abstract type Index end
abstract type AbstractSearchContext end

using Parameters
import Distances: evaluate, PreMetric
export AbstractSearchContext, PreMetric, evaluate, search

"""
    search(searchctx::AbstractSearchContext, q, k::Integer=maxlength(searchctx.res))
    search(searchctx::AbstractSearchContext, q)

This is the most generic search function. It calls almost all implementations whenever an integer k is given.

"""
function search(searchctx::AbstractSearchContext, q, k::Integer=maxlength(searchctx.res))
    empty!(searchctx.res, k)
    search(searchctx, q, searchctx.res)
end

Base.length(searchctx::AbstractSearchContext) = length(searchctx.db)
Base.getindex(searchctx::AbstractSearchContext, i) = searchctx.db[i]
Base.eachindex(searchctx::AbstractSearchContext) = eachindex(searchctx.db)

include("distances/bits.jl")
include("distances/sets.jl")
include("distances/strings.jl")
include("distances/vectors.jl")
include("distances/cos.jl")

include("utils/knnresult.jl")
include("utils/perf.jl")

include("indexes/pivotselection.jl")
include("indexes/seq.jl")
include("indexes/pivottable.jl")
include("indexes/pivotselectiontables.jl")
include("indexes/kvp.jl")

include("graph/graph.jl")
# include("utils/aknn.jl")
# include("utils/classification.jl")
end
