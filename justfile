add *PKGS:
  pnpm add -w {{PKGS}}

add-dev *PKGS:
  pnpm add -w -D {{PKGS}}

rm *PKGS:
  pnpm rm {{PKGS}}

build:
  pnpm run build

test:
  pnpm run test

format:
  pnpm run format
