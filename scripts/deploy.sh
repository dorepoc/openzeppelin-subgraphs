#!/usr/bin/env bash

npx graph-compiler                                      \
  --config ${CONFIG:-configs/kai.json}               \
  --include src/datasources                             \
  --export-subgraph                                     \
  --export-schema                                       &&

npx graph codegen                                       \
  ${SUBGRAPH:-generated/kai.subgraph.yaml}           &&

npx graph build                                         \
  ${SUBGRAPH:-generated/kai.subgraph.yaml}           &&

npx graph deploy                                        \
  --product hosted-service                              \
  ${NAME:-amxx/sandbox}                                 \
  ${SUBGRAPH:-generated/kai.subgraph.yaml}           &&

echo 'done.'
