import neo4j, { Node, Relationship, Integer, QueryResult } from 'neo4j-driver'
import { readActorInRelationActedIn } from './cypher-codes/read-data/read'

interface ActorProperties {
  name: string
  birth_year: number
}

interface MovieProperties {
  title: string
  year: number
  genre: string
}

interface Actor extends Node<Integer, ActorProperties> {}
interface Movie extends Node<Integer, MovieProperties> {}
interface ActedIn extends Relationship<Integer, Record<string, string>> {}

interface ActorActedInMovie {
  a: Actor
  r: ActedIn
  m: Movie
}

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

  async runningSample(cypherCode: string, params?: { [key: string]: string }) {
    try {
      const res: QueryResult<ActorActedInMovie> = await this.session.run(
        cypherCode,
        params,
      )
      const actor = res.records.map((record) => {
        return record.get('a').properties.name
      })
      console.log(actor)
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
        tx.run<ActorActedInMovie>(cypherCode, params),
      )
      console.log(res.records[0].get('a').properties.name)
    } catch (err) {
      console.error(err)
    } finally {
      await this.session.close()
      await driver.close()
    }
  }
}

const main = new Main()
main.runningSample(readActorInRelationActedIn)
