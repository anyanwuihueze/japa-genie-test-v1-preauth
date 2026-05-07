---
title: deck file namespace
source_url: https://github.com/Kong/deck/tree/main/cmd
---

Apply a namespace to routes in a decK file by path or hostname.

There are 2 main ways to namespace api's:

1. use path prefixes, all on the same hostname;
   a. http://api.acme.com/service1/somepath
   b. http://api.acme.com/service2/somepath
2. use separate hostnames
   a. http://service1.api.acme.com/somepath
   b. http://service2.api.acme.com/somepath

For hostnames the --host and --clear-hosts flags are used. Just using --host appends
to the existing hosts, adding --clear-hosts will effectively replace the existing ones.
For path prefixes the --path-prefix flag is used. Combining them is possible.

Note on path-prefixing: To remain transparent to the backend services, the added path
prefix must be removed from the path before the request is routed to the service.
To remove the prefix the following approaches are used (in order):
- if the route has 'strip_path=true' then the added prefix will already be stripped
- if the related service has a 'path' property that matches the prefix, then the
  'service.path' property is updated to remove the prefix
- a "pre-function" plugin will be added to remove the prefix from the path



## Syntax

```
deck file namespace [command-specific flags] [global flags]
```

## Examples

```
# Apply namespace to a deckfile, path and host:
deck file namespace --path-prefix=/kong --host=konghq.com --state=deckfile.yaml

# Apply namespace to a deckfile, and write to a new file
# Example file 'kong.yaml':
routes:
- paths:
  - ~/tracks/system$
  strip_path: true
- paths:
  - ~/list$
  strip_path: false

# Apply namespace to the deckfile, and write to stdout:
cat kong.yaml | deck file namespace --path-prefix=/kong

# Output:
routes:
- paths:
  - ~/kong/tracks/system$
  strip_path: true
  hosts:
  - konghq.com
- paths:
  - ~/kong/list$
  strip_path: false
  hosts:
  - konghq.com
  plugins:
  - name: pre-function
    config:
      access:
      - "local ns='/kong' -- this strips the '/kong' namespace from the path\nlocal <more code here>"


```

## Flags

`--allow-empty-selectors`
:  Do not error out if the selectors return empty (Default: `false`)

`-c`, `--clear-hosts`
:  Clear existing hosts. (Default: `false`)

`--format`
:  Output format: yaml or json. (Default: `"yaml"`)

`-h`, `--help`
:  help for namespace (Default: `false`)

`--host`
:  Hostname to add for host-based namespacing. Repeat for multiple hosts.

`-o`, `--output-file`
:  Output file to write. Use - to write to stdout. (Default: `"-"`)

`-p`, `--path-prefix`
:  The path based namespace to apply.

`--selector`
:  json-pointer identifying element to patch. Repeat for multiple selectors. Defaults to selecting all routes.

`-s`, `--state`
:  decK file to process. Use - to read from stdin. (Default: `"-"`)



## Global flags

`--analytics`
:  Share anonymized data to help improve decK.
Use `--analytics=false` to disable this. (Default: `true`)

`--ca-cert`
:  Custom CA certificate (raw contents) to use to verify Kong's Admin TLS certificate.
This value can also be set using DECK_CA_CERT environment variable.
This takes precedence over `--ca-cert-file` flag.

`--ca-cert-file`
:  Path to a custom CA certificate to use to verify Kong's Admin TLS certificate.
This value can also be set using DECK_CA_CERT_FILE environment variable.

`--config`
:  Config file (default is $HOME/.deck.yaml).

`--headers`
:  HTTP headers (key:value) to inject in all requests to Kong's Admin API.
This flag can be specified multiple times to inject multiple headers.

`--kong-addr`
:  HTTP address of Kong's Admin API.
This value can also be set using the environment variable DECK_KONG_ADDR
 environment variable. (Default: `"http://localhost:8001"`)

`--kong-cookie-jar-path`
:  Absolute path to a cookie-jar file in the Netscape cookie format for auth with Admin Server.
You may also need to pass in as header the User-Agent that was used to create the cookie-jar.

`--konnect-addr`
:  Address of the Konnect endpoint. (Default: `"https://us.api.konghq.com"`)

`--konnect-control-plane-name`
:  Konnect Control Plane name.

`--konnect-email`
:  Email address associated with your Konnect account.

`--konnect-password`
:  Password associated with your Konnect account, this takes precedence over `--konnect-password-file` flag.

`--konnect-password-file`
:  File containing the password to your Konnect account.

`--konnect-token`
:  Personal Access Token associated with your Konnect account, this takes precedence over `--konnect-token-file` flag.

`--konnect-token-file`
:  File containing the Personal Access Token to your Konnect account.

`--no-color`
:  Disable colorized output (Default: `false`)

`--skip-workspace-crud`
:  Skip API calls related to Workspaces (Kong Enterprise only). (Default: `false`)

`--timeout`
:  Set a request timeout for the client to connect with Kong (in seconds). (Default: `10`)

`--tls-client-cert`
:  PEM-encoded TLS client certificate to use for authentication with Kong's Admin API.
This value can also be set using DECK_TLS_CLIENT_CERT environment variable. Must be used in conjunction with tls-client-key

`--tls-client-cert-file`
:  Path to the file containing TLS client certificate to use for authentication with Kong's Admin API.
This value can also be set using DECK_TLS_CLIENT_CERT_FILE environment variable. Must be used in conjunction with tls-client-key-file

`--tls-client-key`
:  PEM-encoded private key for the corresponding client certificate .
This value can also be set using DECK_TLS_CLIENT_KEY environment variable. Must be used in conjunction with tls-client-cert

`--tls-client-key-file`
:  Path to file containing the private key for the corresponding client certificate.
This value can also be set using DECK_TLS_CLIENT_KEY_FILE environment variable. Must be used in conjunction with tls-client-cert-file

`--tls-server-name`
:  Name to use to verify the hostname in Kong's Admin TLS certificate.
This value can also be set using DECK_TLS_SERVER_NAME environment variable.

`--tls-skip-verify`
:  Disable verification of Kong's Admin TLS certificate.
This value can also be set using DECK_TLS_SKIP_VERIFY environment variable. (Default: `false`)

`--verbose`
:  Enable verbose logging levels
Sets the verbosity level of log output (higher is more verbose). (Default: `0`)



## See also

* [deck file](/deck/{{page.kong_version}}/reference/deck_file)	 - Subcommand to host the decK file operations

