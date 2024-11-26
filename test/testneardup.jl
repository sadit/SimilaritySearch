# This file is a part of SimilaritySearch.jl

using Test, SimilaritySearch, LinearAlgebra

@testset "neardup single block" begin
    dist = CosineDistance()
    X = rand(Float32, 4, 100)
    db = VectorDatabase(Vector{Float32}[])
    ϵ = 0.1
    G = SearchGraph(; db, dist)
    ctx = SearchGraphContext()
    D = neardup(G, ctx, MatrixDatabase(X), ϵ; blocksize=100)
    @show D.map D.nn D.dist
    @test all(x -> x <= ϵ, D.dist)
    @test sum(D.dist) > 0
    @test sort(D.map) == sort(unique(D.nn)) 
end

@testset "neardup small block" begin 
    dist = CosineDistance()
    X = rand(Float32, 4, 100)
    db = VectorDatabase(Vector{Float32}[])
    ϵ = 0.1
    G = SearchGraph(; db, dist)
    ctx = SearchGraphContext()
    D = neardup(G, ctx, MatrixDatabase(X), ϵ; blocksize=16)
    @show D.map D.nn D.dist
    @test all(x -> x <= ϵ, D.dist)
    @test sum(D.dist) > 0
    @test sort(D.map) == sort(unique(D.nn)) 
end

@testset "neardup small block with filterblocks=false" begin
    dist = CosineDistance()
    X = rand(Float32, 4, 100)
    db = VectorDatabase(Vector{Float32}[])
    ϵ = 0.1
    G = SearchGraph(; db, dist)
    ctx = SearchGraphContext()
    D = neardup(G, ctx, MatrixDatabase(X), ϵ; blocksize=16, filterblocks=false)
    @show D.map D.nn D.dist
    @test all(x -> x <= ϵ, D.dist)
    @test sum(D.dist) > 0
    @test sort(D.map) == sort(unique(D.nn)) 
end

@testset "neardup small block with filterblocks=false" begin
    dist = CosineDistance()
    X = MatrixDatabase(rand(Float32, 4, 100))
    ϵ = 0.1
    D = neardup(dist, X, ϵ; blocksize=16, filterblocks=true)
    @show D.map D.nn D.dist
    @test all(x -> x <= ϵ, D.dist)
    @test sum(D.dist) > 0
    @test sort(D.map) == sort(unique(D.nn)) 
end

