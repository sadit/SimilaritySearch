# This file is a part of SimilaritySearch.jl

export allknn

"""
    allknn(g::AbstractSearchContext, k::Integer; minbatch=0, pools=getpools(g)) -> knns, dists

Computes all the k nearest neighbors (all vs all) using the index `g`. It removes self references.

Parameters:

- `g`: the index
- `k`: the number of neighbors to retrieve
- `minbatch`: controls how multithreading is used for evaluating configurations, see [`getminbatch`](@ref)
- `pools`: A pools object, dependent of `g`

Returns:

- `knns` a (k, n) matrix of identifiers; the i-th column corresponds to the i-th object in the dataset.
    Zeros can happen to the end of each column meaning that the retrieval was less than the desired `k`
- `dists` a (k, n) matrix of distances; the i-th column corresponds to the i-th object in the dataset.
    Zero values in `knns` should be ignored in `dists`

"""
function allknn(g::AbstractSearchContext, k::Integer; minbatch=0, pools=getpools(g))
    n = length(g)
    knns = zeros(Int32, k, n)
    dists = Matrix{Float32}(undef, k, n)
    allknn(g, knns, dists; minbatch, pools)
end

function _allknn_loop(g::SearchGraph, i, knns, dists, pools)
    k = size(knns, 1) + 1
    res = getknnresult(k, pools)
    vstate = getvstate(length(g), pools)
    c = g[i]
    # visit!(vstate, i)
    # the loop helps to overcome when the current nn is in a small clique (smaller the the desired k)
    ##prev = typemax(Float32)
    for h in g.links[i] # hints
        visited(vstate, h) && continue
        search(g.search_algo, g, c, res, h, pools; vstate)
        ## curr = maximum(res)
        length(res) == k && break
        ##curr == prev && break
        ## prev = curr
    end

    # again for the same issue
    if length(res) < k
        for _ in 1:k
            h = rand(1:length(g))
            visited(vstate, h) && continue
            search(g.search_algo, g, c, res, h, pools; vstate)
            length(res) == k && break
        end
    end

    _allknn_inner_loop(res, i, knns, dists)
    #=_k = length(res)
    knns[1:_k, i] .= res.id
    dists[1:_k, i] .= res.dist=#
end

function _allknn_loop(g, i, knns, dists, pools)
    k = size(knns, 1) + 1
    res = getknnresult(k, pools)
    @inbounds search(g, g[i], res)
    _allknn_inner_loop(res, i, knns, dists)
end

@inline function _allknn_inner_loop(res, objID, knns, dists)
    pos = 0

    @inbounds for (i, id) in enumerate(idview(res))
        if id == objID
            pos = i
            break
        end
    end
    #sp = (objID - 1) * size(knns, 1) + 1    
    #_allknn_inner_loop_copy!(pointer(knns, sp), idview(res), objID, pos)
    _allknn_inner_loop_copy!(knns, idview(res), objID, pos)
    _allknn_inner_loop_copy!(dists, distview(res), objID, pos)
end

function _allknn_inner_loop_copy!(dst, src, objID, pos)
    ep = length(src)
    if pos == 0  # copying k - 1 elements
        ep -= 1
        @inbounds for i in 1:ep
            dst[i, objID] = src[i]
        end
    else
        @inbounds for i in 1:pos-1
            dst[i, objID] = src[i]
        end

        @inbounds for i in pos+1:ep
            dst[i-1, objID] = src[i]
        end
    end
end

"""
allknn(g, knns, dists; parallel_block=512, pools=getpools(g)) -> knns, dists

Computes all the k nearest neighbors (all vs all) using the index `g`. It removes self references.

Arguments:

- `g`: the index
- `knns`: an uninitialized integer matrix of (k, n) size for storing the `k` nearest neighbors of the `n` elements
- `dists`: an uninitialized floating point matrix of (k, n) size for storing the `k` nearest distances of the `n` elements
- `minbatch`: controls how multithreading is used for evaluating configurations, see [`getminbatch`](@ref)
- `pools`: A pools object, dependent of `g`

Results:

- `knns` and `dists` are returned. Note that the index can retrieve less than `k` objects, and these are represented as zeros at the end of each column (can happen)
"""
function allknn(g::AbstractSearchContext, knns::AbstractMatrix{Int32}, dists::AbstractMatrix{Float32}; minbatch=0, pools=getpools(g))
    n = length(g)
    @assert n > 0
    minbatch = getminbatch(minbatch, n)

    if minbatch > 0
        @batch minbatch=minbatch per=thread for i in 1:n
            _allknn_loop(g, i, knns, dists, pools)
        end
    else
        for i in 1:n
            _allknn_loop(g, i, knns, dists, pools)
        end
    end
    
    knns, dists
end