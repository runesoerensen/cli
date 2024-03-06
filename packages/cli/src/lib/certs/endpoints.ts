import {APIClient} from '@heroku-cli/command'
import * as Heroku from '@heroku-cli/schema'

export function meta(appName: string, t: 'sni', certName?: string | undefined) {
  let path
  if (t === 'sni') {
    path = `/apps/${appName}/sni-endpoints`
  } else {
    throw new Error('Unknown type ' + t)
  }

  if (certName) {
    path = `${path}/${certName}`
  }

  return {path, flag: t}
}

function tagAndSort(appName: string, sniCerts: Heroku.SniEndpoint[]) {
  sniCerts.forEach(function (cert) {
    cert._meta = meta(appName, 'sni', cert.name)
  })

  return sniCerts.sort(function (a: Heroku.SniEndpoint, b: Heroku.SniEndpoint) {
    const aName = a?.name || ''
    const bName = b?.name || ''
    return (aName > bName) ? 1 : ((bName > aName) ? -1 : 0)
  })
}

export async function all(appName: string, heroku: APIClient): Promise<Heroku.SniEndpoint[]> {
  const {body: sniCerts} = await heroku.get<Heroku.SniEndpoint[]>(`/apps/${appName}/sni-endpoints`)

  return tagAndSort(appName, sniCerts)
}
