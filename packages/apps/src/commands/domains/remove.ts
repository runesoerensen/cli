import {Flags, CliUx } from '@oclif/core'
import {color} from '@heroku-cli/color'
import {Command, flags} from '@heroku-cli/command'

export default class DomainsRemove extends Command {
  static description = 'remove a domain from an app'

  static examples = ['heroku domains:remove www.example.com']

  static flags = {
    help: Flags.help({char: 'h'}),
    app: flags.app({required: true}),
    remote: flags.remote(),
  }

  static args = [{name: 'hostname', required: true}]

  async run() {
    const {args, flags} = await this.parse(DomainsRemove)
    if (flags.app) {
      CliUx.ux.action.start(`Removing ${color.green(args.hostname)} from ${color.app(flags.app)}`)
    }
    await this.heroku.delete(`/apps/${flags.app}/domains/${args.hostname}`)
    CliUx.ux.action.stop()
  }
}
