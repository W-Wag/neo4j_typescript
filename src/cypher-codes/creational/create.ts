export const createActorNodes = `
CREATE (:Actor {name: 'Leonardo DiCaprio', birth_year: 1974})
CREATE (:Actor {name: 'Christian Bale', birth_year: 1974})
CREATE (:Actor {name: 'Anne Hathaway', birth_year: 1982})
CREATE (:Actor {name: 'Morgan Freeman', birth_year: 1937})
`

export const createMovieNodes = `
CREATE (:Movie {title: 'Inception', year: 2010, genre: 'Science Fiction'})
CREATE (:Movie {title: 'The Dark Knight', year: 2008, genre: 'Action'})
CREATE (:Movie {title: 'Interstellar', year: 2014, genre: 'Science Fiction'})
CREATE (:Movie {title: 'The Shawshank Redemption', year: 1994, genre: 'Drama'})
`

export const CreateRelationActorAndMovie = `

MATCH (m:Movie), (a:Actor)
WHERE m.title = 'Inception' AND a.name = 'Leonardo DiCaprio'
CREATE (a)-[:ACTED_IN]->(m)
WITH m, a

MATCH (m:Movie), (a:Actor)
WHERE m.title = 'Inception' AND a.name = 'Anne Hathaway'
MERGE (a)-[:ACTED_IN]->(m)
WITH m, a

MATCH (m:Movie), (a:Actor)
WHERE m.title = 'The Dark Knight' AND a.name = 'Christian Bale'
MERGE (a)-[:ACTED_IN]->(m)
WITH m, a

MATCH (m:Movie), (a:Actor)
WHERE m.title = 'Interstellar' AND a.name = 'Anne Hathaway'
MERGE (a)-[:ACTED_IN]->(m)
WITH m, a

MATCH (m:Movie), (a:Actor)
WHERE m.title = 'The Shawshank Redemption' AND a.name = 'Morgan Freeman'
MERGE (a)-[:ACTED_IN]->(m)

`
