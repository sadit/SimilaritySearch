var documenterSearchIndex = {"docs":
[{"location":"api/","page":"API","title":"API","text":"\nCurrentModule = SimilaritySearch\nDocTestSetup = quote\n    using SimilaritySearch\nend","category":"page"},{"location":"api/#Indexes","page":"API","title":"Indexes","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"ExhaustiveSearch\nParallelExhaustiveSearch\nSearchGraph","category":"page"},{"location":"api/#SimilaritySearch.ExhaustiveSearch","page":"API","title":"SimilaritySearch.ExhaustiveSearch","text":"ExhaustiveSearch(dist::SemiMetric, db::AbstractVector)\n\nSolves queries evaluating dist for the query and all elements in the dataset\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.ParallelExhaustiveSearch","page":"API","title":"SimilaritySearch.ParallelExhaustiveSearch","text":"ParallelExhaustiveSearch(; dist=SqL2Distance(), db=VectorDatabase{Float32}())\n\nSolves queries evaluating dist in parallel for the query and all elements in the dataset. Note that this should not be used in conjunction with searchbatch(...; parallel=true) since they will compete for resources.\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.SearchGraph","page":"API","title":"SimilaritySearch.SearchGraph","text":"struct SearchGraph <: AbstractSearchIndex\n\nSearchGraph index. It stores a set of points that can be compared through a distance function dist. The performance is determined by the search algorithm search_algo and the neighborhood policy. It supports callbacks to adjust parameters as insertions are made.\n\nhints: Initial points for exploration (empty hints imply using random points)\n\nNote: Parallel insertions should be made through append! or index! function with parallel_block > 1\n\n\n\n\n\n","category":"type"},{"location":"api/#Searching","page":"API","title":"Searching","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"search\nsearchbatch","category":"page"},{"location":"api/#SimilaritySearch.search","page":"API","title":"SimilaritySearch.search","text":"search(seq::ExhaustiveSearch, q, res::KnnResult)\n\nSolves the query evaluating all items in the given query.\n\n\n\n\n\nsearch(ex::ParallelExhaustiveSearch, q, res::KnnResult; minbatch=0, pools=nothing)\n\nSolves the query evaluating all items in the given query.\n\nArguments\n\nex: the search structure\nq: the query to solve\nres: the result set\n\nKeyword arguments\n\nminbatch: Minimum number of queries solved per each thread, see getminbatch\npools: The set of caches (nothing for this index)\n\n\n\n\n\nsearch(bs::BeamSearch, index::SearchGraph, q, res, hints, pools; bsize=bs.bsize, Δ=bs.Δ, maxvisits=bs.maxvisits)\n\nTries to reach the set of nearest neighbors specified in res for q.\n\nbs: the parameters of BeamSearch\nindex: the local search index\nq: the query\nres: The result object, it stores the results and also specifies the kind of query\nhints: Starting points for searching, randomly selected when it is an empty collection\npools: A SearchGraphPools object with preallocated pools\n\nOptional arguments (defaults to values in bs)\n\nbsize: Beam size\nΔ: exploration expansion factor\nmaxvisits: Maximum number of nodes to visit (distance evaluations)\n\n\n\n\n\nsearch(index::SearchGraph, q, res; hints=index.hints, pools=getpools(index))\n\nSolves the specified query res for the query object q.\n\n\n\n\n\n","category":"function"},{"location":"api/#SimilaritySearch.searchbatch","page":"API","title":"SimilaritySearch.searchbatch","text":"searchbatch(index, Q, k::Integer; minbatch=0, pools=GlobalKnnResult) -> indices, distances\n\nSearches a batch of queries in the given index (searches for k neighbors).\n\nArguments\n\nindex: The search structure\nQ: The set of queries\nk: The number of neighbors to retrieve\n\nKeyword arguments\n\nminbatch specifies how many queries are solved per thread.\nIntegers 1  minbatch  Q are valid values\nSet minbatch=0 to compute a default number based on the number of available cores.\nSet minbatch=-1 to avoid parallelism.\npools relevant for special databases or distance functions.    In most case uses the default is enought, but different pools should be used when indexes use other indexes internally to solve queries.   It should be an array of Threads.nthreads() preallocated KnnResult objects used to reduce memory allocations.\n\nNote: The i-th column in indices and distances correspond to the i-th query in Q Note: The final indices at each column can be 0 if the search process was unable to retrieve k neighbors.\n\n\n\n\n\nsearchbatch(index, Q, I::AbstractMatrix{Int32}, D::AbstractMatrix{Float32}; minbatch=0, pools=getpools(index)) -> indices, distances\n\nSearches a batch of queries in the given index and I and D as output (searches for k=size(I, 1))\n\nArguments\n\nindex: The search structure\nQ: The set of queries\nk: The number of neighbors to retrieve\n\nKeyword arguments\n\nminbatch: Minimum number of queries solved per each thread, see getminbatch\npools: relevant for special databases or distance functions.    In most case uses the default is enought, but different pools should be used when indexes use other indexes internally to solve queries.   It should be an array of Threads.nthreads() preallocated KnnResult objects used to reduce memory allocations.\n\n\n\n\n\nsearchbatch(index, Q, KNN::AbstractVector{KnnResult}; minbatch=0, pools=getpools(index)) -> indices, distances\n\nSearches a batch of queries in the given index using an array of KnnResult's; each KnnResult object can specify different k values.\n\nArguments\n\nminbatch: Minimum number of queries solved per each thread, see getminbatch\npools: relevant for special databases or distance functions.    In most case uses the default is enought, but different pools should be used when indexes use other indexes internally to solve queries.   It should be an array of Threads.nthreads() preallocated KnnResult objects used to reduce memory allocations.\n\n\n\n\n\n","category":"function"},{"location":"api/","page":"API","title":"API","text":"Note: KnnResult based functions are significantly faster in general on pre-allocated objects that similar functions accepting matrices of identifiers and distances. Matrix based outputs are based on KnnResult methods that copy their results on the matrices. Preallocation is also costly, so if you have relatively small datasets, you are not intended to repeat the search process many times, or you are unsure, it is safe to use matrix-based functions.","category":"page"},{"location":"api/#Computing-all-knns","page":"API","title":"Computing all knns","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"The operation of computing all knns in the index is computed as follows:","category":"page"},{"location":"api/","page":"API","title":"API","text":"allknn","category":"page"},{"location":"api/#SimilaritySearch.allknn","page":"API","title":"SimilaritySearch.allknn","text":"allknn(g::AbstractSearchIndex, k::Integer; minbatch=0, pools=getpools(g)) -> knns, dists\nallknn(g, knns, dists; minbatch=0, pools=getpools(g)) -> knns, dists\n\nComputes all the k nearest neighbors (all vs all) using the index g. It removes self references.\n\nParameters:\n\ng: the index\nQuery specification and result:\nk: the number of neighbors to retrieve\nknns: an uninitialized integer matrix of (k, n) size for storing the k nearest neighbors of the n elements\ndists: an uninitialized floating point matrix of (k, n) size for storing the k nearest distances of the n elements\nminbatch: controls how multithreading is used for evaluating configurations, see getminbatch\npools: A pools object, dependent of g\n\nReturns:\n\nknns a (k, n) matrix of identifiers; the i-th column corresponds to the i-th object in the dataset.   Zeros can happen to the end of each column meaning that the retrieval was less than the desired k\ndists a (k, n) matrix of distances; the i-th column corresponds to the i-th object in the dataset.   Zero values in knns should be ignored in dists\n\nKeyword arguments\n\nminbatch: controls how multithreading is used for evaluating configurations, see getminbatch\npools: pools: A pools object, dependent of g\n\nNote:\n\nThis function was introduced in v0.8 series, and removes self references automatically. In v0.9 the self reference is kept since removing from the algorithm introduces a considerable overhead.    \n\n\n\n\n\n","category":"function"},{"location":"api/#Computing-closest-pair","page":"API","title":"Computing closest pair","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"The operation of finding the closest pair of elements in the indexed dataset.","category":"page"},{"location":"api/","page":"API","title":"API","text":"closestpair","category":"page"},{"location":"api/#SimilaritySearch.closestpair","page":"API","title":"SimilaritySearch.closestpair","text":"closestpair(idx::AbstractSearchIndex; minbatch=0, pools=getpools(idx))\n\nFinds the closest pair among all elements in idx. If the index idx is approximate then pair of points could be also an approximation.\n\nArguments:\n\nidx: the search structure that indexes the set of points\n\nKeyword Arguments:\n\nminbatch: controls how multithreading is used for evaluating configurations, see getminbatch\npools: The pools needed for the index. Only used for special cases, default values should work in most cases. See getpools for more information.\n\n\n\n\n\n","category":"function"},{"location":"api/#Remove-near-duplicates","page":"API","title":"Remove near duplicates","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"Finds and removes near duplicate items in a metric dataset","category":"page"},{"location":"api/","page":"API","title":"API","text":"neardup","category":"page"},{"location":"api/#SimilaritySearch.neardup","page":"API","title":"SimilaritySearch.neardup","text":"neardup(push_fun::Function, idx::AbstractSearchIndex, X::AbstractDatabase, ϵ::Real; k::Int=8, blocksize::Int=256, minbatch=0, verbose=true)\nneardup(idx::AbstractSearchIndex, X::AbstractVector, ϵ; kwargs)\n\nFind nearest duplicates in database X using the empty index idx. The algorithm iteratively try to index elements in X, and items being near than ϵ to some element in idx will be ignored.\n\nThe function returns a named tuple (idx, map, nn, dist) where:\n\nidx: it is the index of the non duplicated elements\nmap: a mapping from |idx|-1 to its positions in X\nnn: an array where each element in x in X points to its covering element (previously indexed element u such that d(u x_i) leq ϵ)\ndist: an array of distance values to each covering element (correspond to each element in nn)\n\npush_fun argument can be used to customize object insertions, e.g., set SearchGraphCallbacks for SearchGraph, it can be passed as a do block.\n\nArguments\n\nidx: An empty index (i.e., a SearchGraph)\nX: The input dataset\nϵ: Real value to cut\n\nKeyword arguments\n\nk: The number of nearest neighbors to retrieve (some algorithms benefit from retrieving larger k values)\nblocksize: the number of items processed at the time\nminbatch: argument to control @batch macro (see Polyester package multithreading)\nverbose: controls the verbosity of the function\n\nNotes\n\nThe index idx must support incremental construction, e.g., with a valid push_item! implementation\nYou can access the set of elements being 'ϵ'-non duplicates (the ϵ-net) using idx.db or where nn[i] == i\n\n\n\n\n\n","category":"function"},{"location":"api/#Indexing-elements","page":"API","title":"Indexing elements","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"push_item!\nappend_items!\nindex!\nrebuild","category":"page"},{"location":"api/#SimilaritySearch.push_item!","page":"API","title":"SimilaritySearch.push_item!","text":"push_item!(res::KnnResult, p::IdWeight)\npush_item!(res::KnnResult, id::Integer, dist::Real)\n\nAppends an item into the result set\n\n\n\n\n\npush_item!(\n    index::SearchGraph,\n    item;\n    neighborhood=Neighborhood(),\n    push_item=true,\n    callbacks=SearchGraphCallbacks(verbose=index.verbose),\n    pools=getpools(index)\n)\n\nAppends an object into the index. It accepts the same arguments that push! but assuming some default values.\n\nArguments:\n\nindex: The search graph index where the insertion is going to happen\nitem: The object to be inserted, it should be in the same space than other objects in the index and understood by the distance metric.\nneighborhood: A Neighborhood object that specifies the kind of neighborhood that will be computed.\npush_db: if push_db=false is an internal option, used by append! and index! (it avoids to insert item into the database since it is already inserted but not indexed)\ncallbacks: The set of callbacks that are called whenever the index grows enough. Keeps hyperparameters and structure in shape.\npools: The set of caches used for searching.\nNote: callbacks=nothing ignores the execution of any callback\n\n\n\n\n\npush_item!(\n    index::SearchGraph,\n    item,\n    neighborhood,\n    push_item,\n    callbacks,\n    pools\n)\n\nAppends an object into the index\n\nArguments:\n\nindex: The search graph index where the insertion is going to happen.\nitem: The object to be inserted, it should be in the same space than other objects in the index and understood by the distance metric.\nneighborhood: A Neighborhood object that specifies the kind of neighborhood that will be computed.\npush_db: if false is an internal option, used by append! and index! (it avoids to insert item into the database since it is already inserted but not indexed).\ncallbacks: The set of callbacks that are called whenever the index grows enough. Keeps hyperparameters and structure in shape.\npools: The set of caches used for searching.\nNote: setting callbacks as nothing ignores the execution of any callback\n\n\n\n\n\n","category":"function"},{"location":"api/#SimilaritySearch.append_items!","page":"API","title":"SimilaritySearch.append_items!","text":"append_items!(\n    index::SearchGraph,\n    db;\n    neighborhood=Neighborhood(),\n    parallel_block=get_parallel_block(),\n    parallel_minimum_first_block=parallel_block,\n    callbacks=SearchGraphCallbacks(verbose=index.verbose),\n    pools=getpools(index)\n)\n\nAppends all items in db to the index. It can be made in parallel or sequentially.\n\nArguments:\n\nindex: the search graph index\nneighborhood: A Neighborhood object that specifies the kind of neighborhood that will be computed.\ndb: the collection of objects to insert, an AbstractDatabase is the canonical input, but supports any iterable objects\nparallel_block: The number of elements that the multithreading algorithm process at once,   it is important to be larger that the number of available threads but not so large since the quality of the search graph could degrade (a few times the number of threads is enough).   If parallel_block=1 the algorithm becomes sequential.\nparallel_minimum_first_block: The number of sequential appends before running parallel.\n\nNote: Parallel doesn't trigger callbacks inside blocks.\n\ncallbacks: A SearchGraphCallbacks object to be called after some insertions   (specified by the callbacks object). These callbacks are used to maintain the algorithm   in good shape after many insertions (adjust hyperparameters and the structure).\npools: The set of caches used for searching.\n\nNote 1: Callbacks are not executed inside parallel blocks Note 2: Callbacks will be ignored if callbacks=nothing\n\n\n\n\n\n","category":"function"},{"location":"api/#SimilaritySearch.index!","page":"API","title":"SimilaritySearch.index!","text":"index!(index::SearchGraph; parallel_block=get_parallel_block(), parallel_minimum_first_block=parallel_block, callbacks=SearchGraphCallbacks(verbose=index.verbose))\n\nIndexes the already initialized database (e.g., given in the constructor method). It can be made in parallel or sequentially. The arguments are the same than append! function but using the internal index.db as input.\n\n\n\n\n\n","category":"function"},{"location":"api/#SimilaritySearch.rebuild","page":"API","title":"SimilaritySearch.rebuild","text":"rebuild(g::SearchGraph; neighborhood=Neighborhood(), callbacks=SearchGraphCallbacks(verbose=g.verbose), minbatch=0, pools=getpools(index))\n\nRebuilds the SearchGraph index but seeing the whole dataset for the incremental construction, i.e., it can connect the i-th vertex to its knn in the 1..n possible vertices instead of its knn among 1..(i-1) as in the original algorithm.\n\nArguments\n\ng: The search index to be rebuild.\nneighborhood: The neighborhood strategy to follow in the rebuild, it can differ from the original one.\ncallbacks: The set of callbacks\nminbatch: controls how the multithreading is made, see getminbatch\npools: The set of caches for the indexes\n\n\n\n\n\n","category":"function"},{"location":"api/#Distance-functions","page":"API","title":"Distance functions","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"The distance functions are defined to work under the evaluate(::metric, u, v) function (borrowed from Distances.jl package).","category":"page"},{"location":"api/#Minkowski-vector-distance-functions","page":"API","title":"Minkowski vector distance functions","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"L1Distance\nL2Distance\nSqL2Distance\nLInftyDistance\nLpDistance","category":"page"},{"location":"api/#SimilaritySearch.L1Distance","page":"API","title":"SimilaritySearch.L1Distance","text":"L1Distance()\n\nThe manhattan distance or L_1 is defined as\n\nL_1(u v) = sum_iu_i - v_i\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.L2Distance","page":"API","title":"SimilaritySearch.L2Distance","text":"L2Distance()\n\nThe euclidean distance or L_2 is defined as\n\nL_2(u v) = sqrtsum_i(u_i - v_i)^2\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.SqL2Distance","page":"API","title":"SimilaritySearch.SqL2Distance","text":"SqL2Distance()\n\nThe squared euclidean distance is defined as\n\nL_2(u v) = sum_i(u_i - v_i)^2\n\nIt avoids the computation of the square root and should be used whenever you are able do it.\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.LInftyDistance","page":"API","title":"SimilaritySearch.LInftyDistance","text":"LInftyDistance()\n\nThe Chebyshev or L_infty distance is defined as\n\nL_infty(u v) = max_ileft u_i - v_i right\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.LpDistance","page":"API","title":"SimilaritySearch.LpDistance","text":"LpDistance(p)\nLpDistance(p, pinv)\n\nThe general Minkowski distance L_p distance is defined as\n\nL_p(u v) = leftsum_i(u_i - v_i)^pright^1p\n\nWhere p_inv = 1p. Note that you can specify unrelated p and pinv if you need an specific behaviour.\n\n\n\n\n\n","category":"type"},{"location":"api/","page":"API","title":"API","text":"The package implements some of these functions using the @turbo macro from LoopVectorization package.","category":"page"},{"location":"api/","page":"API","title":"API","text":"TurboL1Distance\nTurboL2Distance\nTurboSqL2Distance\nTurboNormalizedCosineDistance\n","category":"page"},{"location":"api/#SimilaritySearch.TurboL1Distance","page":"API","title":"SimilaritySearch.TurboL1Distance","text":"TurboL1Distance()\n\nThe @turboed implementation of L1Distance, see LoopVectorization.\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.TurboL2Distance","page":"API","title":"SimilaritySearch.TurboL2Distance","text":"TurboL2Distance()\n\nThe @turboed implementation of L2Distance, see LoopVectorization.\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.TurboSqL2Distance","page":"API","title":"SimilaritySearch.TurboSqL2Distance","text":"TurboSqL2Distance()\n\nThe @turboed implementation of SqL2Distance, see LoopVectorization.\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.TurboNormalizedCosineDistance","page":"API","title":"SimilaritySearch.TurboNormalizedCosineDistance","text":"TurboNormalizedCosineDistance()\n\nThe @turboed implementation of CosineDistance, see LoopVectorization.\n\n\n\n\n\n","category":"type"},{"location":"api/#Cosine-and-angle-distance-functions-for-vectors","page":"API","title":"Cosine and angle distance functions for vectors","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"CosineDistance\nNormalizedCosineDistance\nAngleDistance\nNormalizedAngleDistance","category":"page"},{"location":"api/#SimilaritySearch.CosineDistance","page":"API","title":"SimilaritySearch.CosineDistance","text":"CosineDistance()\n\nThe cosine is defined as:\n\ncos(u v) = fracsum_i u_i v_isqrtsum_i u_i^2 sqrtsum_i v_i^2\n\nThe cosine distance is defined as 1 - cos(uv)\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.NormalizedCosineDistance","page":"API","title":"SimilaritySearch.NormalizedCosineDistance","text":"NormalizedCosineDistance()\n\nSimilar to CosineDistance but suppose that input vectors are already normalized, and therefore, reduced to simply one minus the dot product.\n\n1 - sum_i u_i v_i\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.AngleDistance","page":"API","title":"SimilaritySearch.AngleDistance","text":"AngleDistance()\n\nThe angle distance is defined as:\n\n(u v)= arccos(cos(u v))\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.NormalizedAngleDistance","page":"API","title":"SimilaritySearch.NormalizedAngleDistance","text":"NormalizedAngleDistance()\n\nSimilar to AngleDistance but suppose that input vectors are already normalized\n\narccos sum_i u_i v_i\n\n\n\n\n\n","category":"type"},{"location":"api/#Set-distance-functions","page":"API","title":"Set distance functions","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"Set bbject are represented as ordered arrays","category":"page"},{"location":"api/","page":"API","title":"API","text":"JaccardDistance\nDiceDistance\nIntersectionDissimilarity\nCosineDistanceSet","category":"page"},{"location":"api/#SimilaritySearch.JaccardDistance","page":"API","title":"SimilaritySearch.JaccardDistance","text":"JaccardDistance()\n\nThe Jaccard distance is defined as\n\nJ(u v) = fracu cap vu cup v\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.DiceDistance","page":"API","title":"SimilaritySearch.DiceDistance","text":"DiceDistance()\n\nThe Dice distance is defined as\n\nD(u v) = frac2 u cap vu + v\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.IntersectionDissimilarity","page":"API","title":"SimilaritySearch.IntersectionDissimilarity","text":"IntersectionDissimilarity()\n\nThe intersection dissimilarity uses the size of the intersection as a mesuare of similarity as follows:\n\nI(u v) = 1 - fracu cap vmax u v\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.CosineDistanceSet","page":"API","title":"SimilaritySearch.CosineDistanceSet","text":"CosineDistanceSet()\n\nThe cosine distance for very sparse binary vectors represented as sorted lists of positive integers where ones occur.\n\n\n\n\n\n","category":"type"},{"location":"api/#String-alignment-distances","page":"API","title":"String alignment distances","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"The following uses strings/arrays as input, i.e., objects follow the array interface. A broader set of distances for strings can be found in the StringDistances.jl package.","category":"page"},{"location":"api/","page":"API","title":"API","text":"CommonPrefixDissimilarity\nGenericLevenshteinDistance\nStringHammingDistance\nLevenshteinDistance\nLcsDistance","category":"page"},{"location":"api/#SimilaritySearch.CommonPrefixDissimilarity","page":"API","title":"SimilaritySearch.CommonPrefixDissimilarity","text":"CommonPrefixDissimilarity()\n\nUses the common prefix as a measure of dissimilarity between two strings\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.GenericLevenshteinDistance","page":"API","title":"SimilaritySearch.GenericLevenshteinDistance","text":"GenericLevenshteinDistance(;icost, dcost, rcost)\n\nThe levenshtein distance measures the minimum number of edit operations to convert one string into another. The costs insertion icost, deletion cost dcost, and replace cost rcost. Not thread safe, use a copy of for each thread.\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.StringHammingDistance","page":"API","title":"SimilaritySearch.StringHammingDistance","text":"StringHammingDistance()\n\nThe hamming distance counts the differences between two equally sized strings\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.LevenshteinDistance","page":"API","title":"SimilaritySearch.LevenshteinDistance","text":"LevenshteinDistance()\n\nInstantiates a GenericLevenshteinDistance object to perform traditional levenshtein distance\n\n\n\n\n\n","category":"function"},{"location":"api/#SimilaritySearch.LcsDistance","page":"API","title":"SimilaritySearch.LcsDistance","text":"LcsDistance()\n\nInstantiates a GenericLevenshteinDistance object to perform LCS distance\n\n\n\n\n\n","category":"function"},{"location":"api/#Distances-for-Cloud-of-points","page":"API","title":"Distances for Cloud of points","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"HausdorffDistance\nMinHausdorffDistance","category":"page"},{"location":"api/#SimilaritySearch.HausdorffDistance","page":"API","title":"SimilaritySearch.HausdorffDistance","text":"HausdorffDistance(dist::SemiMetric)\n\nHausdorff distance is defined as the maximum of the minimum between two clouds of points.\n\nHausdorff(U V) = maxmax_u in U nndist(u V) maxv in V nndist(v U) \n\nwhere nndist(u V) computes the distance of u to its nearest neighbor in V using the dist metric.\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.MinHausdorffDistance","page":"API","title":"SimilaritySearch.MinHausdorffDistance","text":"MinHausdorffDistance(dist::SemiMetric)\n\nSimilar to HausdorffDistance but using minimum instead of maximum.\n\n\n\n\n\n","category":"type"},{"location":"api/#Functions-that-customize-parameters","page":"API","title":"Functions that customize parameters","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"Several algorithms support arguments that modify the performance, for instance, some of them should be computed or prepared with external functions or structs","category":"page"},{"location":"api/","page":"API","title":"API","text":"getminbatch\ngetknnresult\ngetpools\nNeighborhood\nCallback\nSearchGraphCallbacks\nBeamSearchSpace","category":"page"},{"location":"api/#SimilaritySearch.getminbatch","page":"API","title":"SimilaritySearch.getminbatch","text":"getminbatch(minbatch, n)\n\nUsed by functions that use parallelism based on Polyester.jl minibatches specify how many queries (or something else) are solved per thread whenever the thread is used (in minibatches). \n\nArguments\n\nminbatch\nIntegers 1  minbatch  n are valid values (where n is the number of objects to process, i.e., queries)\nDefaults to 0 which computes a default number based on the number of available cores and n.\nSet minbatch=-1 to avoid parallelism.\n\n\n\n\n\n","category":"function"},{"location":"api/#SimilaritySearch.getknnresult","page":"API","title":"SimilaritySearch.getknnresult","text":"getknnresult(k::Integer, pools=nothing) -> KnnResult\n\nGeneric function to obtain a shared result set for the same thread and avoid memory allocations. This function should be specialized for indexes and pools that use shared results or threads in some special way.\n\n\n\n\n\n","category":"function"},{"location":"api/#SimilaritySearch.getpools","page":"API","title":"SimilaritySearch.getpools","text":"getpools(index::SearchGraph)\n\nCreates or retrieve caches for the search graph.\n\n\n\n\n\n","category":"function"},{"location":"api/#SimilaritySearch.Neighborhood","page":"API","title":"SimilaritySearch.Neighborhood","text":"Neighborhood(; logbase=2, minsize=2, reduce=SatNeighborhood())\n\nDetermines the size of the neighborhood, k is adjusted as a callback, and it is intended to affect previously inserted vertices. The neighborhood is designed to consider two components k=in+out, i.e. incoming and outgoing edges for each vertex.\n\nThe out size is computed as minsize + log(logbase n) where n is the current number of indexed elements; this is computed searching\n\nfor out  elements in the current index.\n\nThe in size is unbounded.\nreduce is intended to postprocess neighbors (after search process, i.e., once out edges are computed); do not change k but always must return a copy of the reduced result set.\n\nNote: Set logbase=Inf to obtain a fixed number of in nodes; and set minsize=0 to obtain a pure logarithmic growing neighborhood.\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.Callback","page":"API","title":"SimilaritySearch.Callback","text":"abstract type Callback end\n\nAbstract type to trigger callbacks after some number of insertions. SearchGraph stores the callbacks in callbacks (a dictionary that associates symbols and callback objects); A SearchGraph object controls when callbacks are fired using callback_logbase and callback_starting\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.SearchGraphCallbacks","page":"API","title":"SimilaritySearch.SearchGraphCallbacks","text":"struct SearchGraphCallbacks     hints::Union{Nothing,Callback}     hyperparameters::Union{Nothing,Callback}     logbase::Float32     starting::Int32 end\n\nCall insertions and indexing methods with SearchGraphCallbacks objects to control how the index structure is adjusted (callbacks are called when n  starting and lceil(log(logbase n)rceil = lceillog(logbase n+1)rceil)\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.BeamSearchSpace","page":"API","title":"SimilaritySearch.BeamSearchSpace","text":"BeamSearchSpace(; bsize, Δ, bsize_scale, Δ_scale)\n\nDefine search space for beam search autotuning\n\n\n\n\n\n","category":"type"},{"location":"api/#Database-API","page":"API","title":"Database API","text":"","category":"section"},{"location":"api/","page":"API","title":"API","text":"AbstractDatabase\nMatrixDatabase\nVectorDatabase\nDynamicMatrixDatabase\nStrideMatrixDatabase","category":"page"},{"location":"api/#SimilaritySearch.AbstractDatabase","page":"API","title":"SimilaritySearch.AbstractDatabase","text":"abstract type AbstractDatabase end\n\nBase type to represent databases. A database is a collection of objects that can be accessed like a similar interface to AbstractVector. It is separated to allow SimilaritySearch methods to know what is a database and what is an object (since most object representations will look as vectors and matrices). \n\nThe basic implementations are:\n\nMatrixDatabase: A wrapper for object-vectors stored in a Matrix, columns are the objects. It is static.\nDynamicMatrixDatabase: A dynamic representation for vectors that allows adding new vectors.\nVectorDatabase: A wrapper for vector-like structures. It can contain any kind of objects.\nSubDatabase: A sample of a given database\n\nIn particular, the storage details are not used by VectorDatabase and MatrixDatabase. For instance, it is possible to use matrices like Matrix, SMatrix or StrideArrays; or even use generated objects with VectorDatabase (supporting a vector-like interface).\n\nIf the storage backend support it, it is possible to use vector operations, for example:\n\nget the i-th element obj = db[i], elements in the database are identified by position\nget the elements list in a list of indices lst as db[lst] (also using view)\nset a value at the i-th element db[i] = obj\nrandom sampling rand(db), rand(db, 3)\niterate and collect objects in the database\nget the number of elements in the database length(db)\nadd new objects to the end of the database (not all internal containers will support it)\npush_item!(db, u) adds a single element u\nappend_items!(db, lst) adds a list of objects to the end of the database\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.MatrixDatabase","page":"API","title":"SimilaritySearch.MatrixDatabase","text":"struct MatrixDatabase{M<:AbstractDatabase} <: AbstractDatabase\n\nMatrixDatabase(matrix::AbstractMatrix)\n\nWraps a matrix-like object matrix into a MatrixDatabase. Please see AbstractDatabase for general usage.\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.VectorDatabase","page":"API","title":"SimilaritySearch.VectorDatabase","text":"struct VectorDatabase{V} <: AbstractDatabase\n\nA wrapper for vector-like databases\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.DynamicMatrixDatabase","page":"API","title":"SimilaritySearch.DynamicMatrixDatabase","text":"struct DynamicMatrixDatabase{DType,Dim} <: AbstractDatabase\n\nA dynamic matrix with elements of type DType and dimension Dim \n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.StrideMatrixDatabase","page":"API","title":"SimilaritySearch.StrideMatrixDatabase","text":"struct StrideMatrixDatabase{M<:StrideArray} <: AbstractDatabase\n\nStrideMatrixDatabase(matrix::StrideArray)\n\nWraps a matrix object into a StrideArray and wrap it as a database. Please see AbstractDatabase for general usage.\n\n\n\n\n\n","category":"type"},{"location":"api/","page":"API","title":"API","text":"\nfind_neighborhood\npush_neighborhood\nSatPruning\nRandomPruning\nKeepNearestPruning\nNeighborhoodPruning\nmaxlength\nget_parallel_block\nSimilarityFromDistance\nexecute_callbacks\n","category":"page"},{"location":"api/#SimilaritySearch.find_neighborhood","page":"API","title":"SimilaritySearch.find_neighborhood","text":"find_neighborhood(index::SearchGraph{T}, item, neighborhood, pools; hints=index.hints)\n\nSearches for item neighborhood in the index, i.e., if item were in the index whose items should be its neighbors (intenal function). res is always reused since reduce creates a new KnnResult from it (a copy if reduce in its simpler terms)\n\nArguments\n\nindex: The search index.\nitem: The item to be inserted.\nneighborhood: A Neighborhood object that describes how to compute item's neighborhood.\npools: Cache pools to be used\nhints: Search hints\n\n\n\n\n\n","category":"function"},{"location":"api/#SimilaritySearch.SatPruning","page":"API","title":"SimilaritySearch.SatPruning","text":"SatPruning(k, satkind)\nSatPruning(k)\n\nSelects SatNeighborhood or DistalSatNeighborhood for each vertex. Defaults to DistalSatNeighborhood.\n\nk: the threshold size to apply the Sat reduction, i.e., neighbors larger than k will be pruned.\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.RandomPruning","page":"API","title":"SimilaritySearch.RandomPruning","text":"RandomPruning(k)\n\nSelects k random edges for each vertex\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.KeepNearestPruning","page":"API","title":"SimilaritySearch.KeepNearestPruning","text":"KeepNearestPruning(k)\n\nKept k nearest neighbor edges for each vertex\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.NeighborhoodPruning","page":"API","title":"SimilaritySearch.NeighborhoodPruning","text":"NeighborhoodPruning\n\nAbstract data type for neighborhood pruning strategies\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.maxlength","page":"API","title":"SimilaritySearch.maxlength","text":"maxlength(res::KnnResult)\n\nThe maximum allowed cardinality (the k of knn)\n\n\n\n\n\n","category":"function"},{"location":"api/#SimilaritySearch.get_parallel_block","page":"API","title":"SimilaritySearch.get_parallel_block","text":"get_parallel_block()\n\nUsed by SearchGraph insertion functions to solve find_neighborhood in blocks. Small blocks are better to ensure quality; faster constructions will be achieved if parallel_block is a multiply of Threads.nthreads()\n\n\n\n\n\n","category":"function"},{"location":"api/#SimilaritySearch.SimilarityFromDistance","page":"API","title":"SimilaritySearch.SimilarityFromDistance","text":"SimilarityFromDistance(dist)\n\nEvaluates as 1(1 + d) for a distance evaluation d of dist. This is not a distance function and is part of the hacks to get a similarity  for searching farthest elements on indexes that can handle this hack (e.g., ExhaustiveSearch, ParallelExhaustiveSearch, SearchGraph).\n\n\n\n\n\n","category":"type"},{"location":"api/#SimilaritySearch.execute_callbacks","page":"API","title":"SimilaritySearch.execute_callbacks","text":"execute_callbacks(index::SearchGraph, n=length(index), m=n+1)\n\nProcess all registered callbacks\n\n\n\n\n\n","category":"function"},{"location":"","page":"Home","title":"Home","text":"CurrentModule = SimilaritySearch","category":"page"},{"location":"#SimilaritySearch.jl","page":"Home","title":"SimilaritySearch.jl","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"SimilaritySearch.jl is a library for nearest neighbor search. In particular, it contains the implementation for SearchGraph, a fast and flexible search index.","category":"page"},{"location":"","page":"Home","title":"Home","text":"The following manuscript describes and benchmarks version 0.6:","category":"page"},{"location":"","page":"Home","title":"Home","text":"@article{tellezscalable,\n  title={A scalable solution to the nearest neighbor search problem through local-search methods on neighbor graphs},\n  author={Tellez, Eric S and Ruiz, Guillermo and Chavez, Edgar and Graff, Mario},\n  journal={Pattern Analysis and Applications},\n  pages={1--15},\n  publisher={Springer}\n}\n","category":"page"},{"location":"","page":"Home","title":"Home","text":"The current algorithm (version 0.8) is described and benchmarked in the following manuscript:","category":"page"},{"location":"","page":"Home","title":"Home","text":"\n@misc{tellez2022similarity,\n      title={Similarity search on neighbor's graphs with automatic Pareto optimal performance and minimum expected quality setups based on hyperparameter optimization}, \n      author={Eric S. Tellez and Guillermo Ruiz},\n      year={2022},\n      eprint={2201.07917},\n      archivePrefix={arXiv},\n      primaryClass={cs.IR}\n}","category":"page"},{"location":"#Installing-SimilaritySearch","page":"Home","title":"Installing SimilaritySearch","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"You may install the package as follows","category":"page"},{"location":"","page":"Home","title":"Home","text":"] add SimilaritySearch.jl","category":"page"},{"location":"","page":"Home","title":"Home","text":"also, you can run the set of tests as follows","category":"page"},{"location":"","page":"Home","title":"Home","text":"] test SimilaritySearch","category":"page"},{"location":"#Using-the-library","page":"Home","title":"Using the library","text":"","category":"section"},{"location":"","page":"Home","title":"Home","text":"You can find a brief tutorial and examples in https://github.com/sadit/SimilaritySearchDemos. You will find a list of Jupyter and Pluto notebooks, and some scripts that exemplifies its usage.","category":"page"}]
}
