import neo4j from 'neo4j-driver'

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
        MATCH (p:Person)-[:ACTED_IN]->(:Movie {title: $title})
        RETURN p
      `,
        { title: 'The Matrix' },
        { timeout: 20000 },
      )
      const people = res.records[0].get('p')
      console.log(people)
    } catch (err) {
      console.error(err)
    } finally {
      await this.session.close()
      await driver.close()
    }
  }

  async createDataExample() {
    try {
      const cypher = `
      MERGE (p:Person {name: $name})
      MERGE (m: Movie {title: $title})
      CREATE (p)-[:ACTED_IN]->(m)
      RETURN p, m`

      const params = { name: 'Rodrigo Santoro', title: 'The Matrix' }

      const res = await this.session.executeWrite((tx) =>
        tx.run(cypher, params),
      )
      console.log(res.records[0].get('m'))
    } catch (err) {
      console.error(err)
    } finally {
      await this.session.close()
      await driver.close()
    }
  }
}

const main = new Main()
main.verifyConnectivity()
