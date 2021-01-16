# This file is a part of SimilaritySearch.jl
# License is Apache 2.0: https://www.apache.org/licenses/LICENSE-2.0.txt

export sss, distant_tournament #, KvpTournament

function sss(dist::PreMetric, db::Array{T,1}; alpha::Real=0.35, shuf=false) where T
    pivots = [db[refID] for refID in select_sss(dist, db, alpha, shuf=shuf)]
    PivotedSearch(dist, db, pivots)
end

function distant_tournament(dist::PreMetric, db::Array{T,1}, numrefs::Integer, tournamentsize::Integer=3) where T
    pivots = [db[refID] for refID in select_tournament(dist, db, numrefs, tournamentsize)]
    PivotedSearch(dist, db, pivots)
end

# function KvpTournament(db::Array{T,1}, dist, k::Int, numrefs::Int, tournamentsize::Int=0) where T
#     #pivots = [db[refID] for refID in select_tournament(db, numrefs, tournamentsize, dist)]
#     pivots = select_tournament(db, dist, numrefs, tournamentsize)
#     Kvp(db, dist, k, pivots)
# end
