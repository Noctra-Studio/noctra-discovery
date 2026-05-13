# Noctra Ops Monorepo

Base monorepo para la plataforma operativa de Noctra.

## Workspaces

- `apps/ops-web`: app principal de `ops.noctra.studio`
- `packages/db-types`: tipos compartidos generados desde Supabase
- `packages/validations`: schemas compartidos de validación
- `packages/ui`: espacio reservado para componentes compartidos
- `packages/business`: espacio reservado para lógica de negocio compartida

## Scripts

```bash
npm run dev
npm run build
npm run lint
```

Todos los scripts raíz delegan a `apps/ops-web`.
