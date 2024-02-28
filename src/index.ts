import neo4j, { Record } from 'neo4j-driver'

const driver = neo4j.driver(
  'neo4j://localhost:7687',
  neo4j.auth.basic('neo4j', 'teste123'),
  { disableLosslessIntegers: true },
)

class Main {
  private session = driver.session()

  async verifyConnectivity() {
    const serverInfo = await driver.getServerInfo()
    console.log(serverInfo)
    await driver.close()
  }

  async runningSample() {
    try {
      const res = await this.session.run(
        `
        MATCH (a:Actor)-[r:ACTED_IN]->(m:Movie)
        RETURN a.name
      `,
        { title: 'The Matrix' },
        { timeout: 20000 },
      )
      const people = res.records.map((record: Record) => {
        return record.get('a.name')
      })
      console.log(people)
    } catch (err) {
      console.error(err)
    } finally {
      await this.session.close()
      await driver.close()
    }
  }

  async createDataExample(
    cypherCode: string,
    params?: { [key: string]: string },
  ) {
    try {
      const res = await this.session.executeWrite((tx) =>
        tx.run(cypherCode, params),
      )
      console.log(res.records)
    } catch (err) {
      console.error(err)
    } finally {
      await this.session.close()
      await driver.close()
    }
  }
}

const main = new Main()
const cypher = `

MATCH (m:Movie), (a:Actor)
WHERE m.title = 'The Dark Knight' AND a.name = 'Christian Bale'
MERGE (a)-[:ACTED_IN]->(m)
WITH m, a // Pass along the matched nodes

MATCH (m:Movie), (a:Actor)
WHERE m.title = 'The Shawshank Redemption' AND a.name = 'Morgan Freeman'
MERGE (a)-[:ACTED_IN]->(m)
WITH m, a // Pass along the matched nodes

MATCH (m:Movie), (a:Actor)
WHERE m.title = 'Interstellar' AND a.name = 'Anne Hathaway'
MERGE (a)-[:ACTED_IN]->(m)

`
main.createDataExample(cypher)
