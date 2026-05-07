---
title: deck file openapi2kong
source_url: https://github.com/Kong/deck/tree/main/cmd
---

Convert OpenAPI files to Kong's decK format.

The example file at https://github.com/Kong/go-apiops/blob/main/docs/learnservice_oas.yaml
has extensive annotations explaining the conversion process, as well as all supported 
custom annotations (x-kong-... directives).

The output will be targeted at Kong version 3.x.


## Syntax

```
deck file openapi2kong [command-specific flags] [global flags]
```

## Examples

```
# Convert an OAS file, adding 2 tags, with inso compatibility enabled
cat service_oas.yml | deck file openapi2kong --inso-compatible --select-tag=serviceA,teamB
```

## Flags

`--format`
:  output format: yaml or json (Default: `"yaml"`)

`--generate-security`
:  generate OpenIDConnect plugins from the security directives (Default: `false`)

`-h`, `--help`
:  help for openapi2kong (Default: `false`)

`--ignore-security-errors`
:  ignore errors for unsupported security schemes (Default: `false`)

`-i`, `--inso-compatible`
:  This flag will enable Inso compatibility. The generated entity names will be
the same, and no 'id' fields will be generated. (Default: `false`)

`--no-id`
:  Setting this flag will skip UUID generation for entities (no 'id' fields
will be added, implicit if '--inso-compatible' is set). (Default: `false`)

`-o`, `--output-file`
:  Output file to write. Use - to write to stdout. (Default: `"-"`)

`--select-tag`
:  Select tags to apply to all entities. If omitted, uses the "x-kong-tags"
directive from the file.

`-s`, `--spec`
:  OpenAPI spec file to process. Use - to read from stdin. (Default: `"-"`)

`--uuid-base`
:  The unique base-string for uuid-v5 generation of entity IDs. If omitted,
uses the root-level "x-kong-name" directive, or falls back to 'info.title'.)



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

