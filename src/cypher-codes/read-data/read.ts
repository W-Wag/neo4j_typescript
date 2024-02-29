export const readActorInRelationActedIn = `
              MATCH (a:Actor)-[r:ACTED_IN]->(m:Movie)
              RETURN a
            `
