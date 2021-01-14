# This file is a part of SimilaritySearch.jl
# License is Apache 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

export Item, AbstractKnnResult, KnnResult, maxlength, covrad

abstract type AbstractKnnResult end

struct Item
    id::Int32
    dist::Float32
end

Base.isless(a::Item, b::Item) = isless(a.dist, b.dist)

mutable struct KnnResult <: AbstractKnnResult
    n::Int32
    N::Int32
    pool::Vector{Item}

    function KnnResult(k::Integer)
        new(0, k, Vector{Item}(undef, k))
    end
end

"""
    fix_order!(res::KnnResult, n)

Fixes the sorted state of the array. It implements a kind of insertion sort
It is efficient due to the expected distribution of the items being inserted
(it is expected just a few elements smaller than the current ones)
"""
@inline function fix_order!(K, n::Integer)
    while n > 1
        @inbounds if K[n] < K[n-1]
            @inbounds K[n], K[n-1] = K[n-1], K[n]
        else
            break
        end
        n -= 1
    end
end

"""
    push!(p::KnnResult, item::Item) where T

Appends an item into the result set
"""

@inline function Base.push!(res::KnnResult, p::Pair)
    push!(res, p.first, p.second)
end

@inline function Base.push!(res::KnnResult, id::I, dist::F) where I where F
    if res.n < res.N # length(res.pool)
        # fewer elements than the maximum capacity
        res.n += 1
        @inbounds res.pool[res.n] = Item(id, dist)
        fix_order!(res.pool, res.n)
        return true
    end

    # @show id => dist, res
    if dist >= last(res).dist
        # p.k == length(p.pool) but p.dist doesn't improve the pool's radius
        return false
    end

    # p.k == length(p.pool) but p.dist improves the result set
    @inbounds res.pool[res.n] = Item(id, dist)
    fix_order!(res.pool, res.n)
    true
end

"""
    first(p::KnnResult)

Return the first item of the result set, the closest item
"""
Base.first(res::KnnResult) = @inbounds res.pool[1]

"""
    last(p::KnnResult) 

Returns the last item of the result set
"""
Base.last(res::KnnResult) = @inbounds res.pool[res.n]

"""
    popfirst!(p::KnnResult)

Removes and returns the nearest neeighboor from the pool, an O(length(p.pool)) operation
"""
@inline function Base.popfirst!(res::KnnResult)
    @inbounds e = res.pool[1]
    for i in 2:length(res)
        @inbounds res.pool[i-1] = res.pool[i]
    end
    res.n -= 1
    e
end

"""
    pop!(p)

Removes and returns the last item in the pool, it is an O(1) operation
"""
@inline function pop!(res::KnnResult)
    @inbounds e = res.pool[res.n]
    res.n -= 1
    e
end

"""
    length(p::KnnResult)

length returns the number of items in the result set
"""
@inline Base.length(res::KnnResult) = res.n

"""
    maxlength(res::KnnResult)

The maximum allowed cardinality (the k of knn)
"""
@inline maxlength(res::KnnResult) = length(res.pool)

"""
    covrad(p::KnnResult)

Returns the coverage radius of the result set; if length(p) < K then typemax(Float32) is returned
"""
@inline covrad(res::KnnResult) = length(res) < maxlength(res) ? typemax(Float32) : res.pool[end].dist

"""
    empty!(p::KnnResult)
    empty!(res::KnnResult, k::Integer)

Clears the content of the result pool. If k is given then the size of the pool is changed; the internal buffer is adjusted
as needed (only grows).
"""
@inline function Base.empty!(res::KnnResult)
    res.n = 0
end

@inline function Base.empty!(res::KnnResult, k::Integer)
    res.n = 0
    res.N = k
    k > maxlength(res) && resize!(res.pool, k)
    res
end

@inline function Base.getindex(res::KnnResult, k::Integer)
    res.pool[i]
end

@inline function Base.lastindex(res::KnnResult)
    res.n
end

##### iterator interface
### KnnResult
function Base.iterate(res::KnnResult, state::Int=1)
    n = length(res)
    if n == 0 || state > length(res)
        nothing
    else
        @inbounds res.pool[state], state + 1
    end
end
