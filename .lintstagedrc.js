module.exports = {
  '{apps,libs,tools}/**/*.{ts,js,json}': [
    'nx affected --target=lint --uncommited --fix=true --base=dev --head=HEAD',
    'nx affected --target=lint --uncommited --base=dev --head=HEAD',
    'nx format:write --uncommited --base=dev --head=HEAD',
  ],
}
