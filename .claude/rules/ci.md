---
paths:
  - .github/**
---

# GitHub Actions conventions

## Permisos mínimos

Todo workflow debe declarar permisos explícitos. El mínimo:

```yaml
permissions:
  contents: read
```

Si el job no necesita ningún permiso:

```yaml
permissions: {}
```

## SHA pinning

Todas las actions externas deben usar SHA completo, nunca tags mutables:

```yaml
# Correcto
uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4.2.2

# Incorrecto — tag mutable
uses: actions/checkout@v4
```

## Secrets

- Nunca hardcodear tokens o API keys en el YAML
- Usar `${{ secrets.NOMBRE }}` para todos los valores sensibles
- Documentar qué secrets necesita cada workflow en un comentario en la cabecera

## Node

- Usar Node 22 como versión estándar del proyecto
