# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vue 2 + Element UI admin dashboard based on [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin). Features role-based permission authentication, dynamic routing, mock data, and i18n support.

## Development Commands

```bash
# Start development server (http://localhost:9527)
npm run dev

# Production build
npm run build:prod

# Staging build
npm run build:stage

# Preview production build
npm run preview
npm run preview -- --report  # with bundle analysis

# Linting
npm run lint
npm run lint -- --fix  # auto-fix issues

# Run unit tests
npm run test:unit

# CI test (lint + unit tests)
npm run test:ci

# Generate new components/views using plop templates
npm run new
```

## Architecture

### Directory Structure

- `src/api/` - API layer. Each file exports functions using the axios-based `request` utility
- `src/store/modules/` - Vuex modules (auto-loaded via `require.context`). Key modules: `user`, `app`, `permission`, `tagsView`, `settings`
- `src/router/modules/` - Route configuration modules. Routes can be `constantRoutes` (public) or `asyncRoutes` (role-based)
- `src/views/` - Page components organized by feature
- `src/components/` - Shared components
- `src/directive/` - Custom Vue directives (permission, clipboard, drag-dialog, waves)
- `src/utils/` - Utilities. Key files:
  - `request.js` - Axios instance with interceptors, token injection, and error handling
  - `auth.js` - Token storage using js-cookie

### Key Systems

**Permission/Routing** (`src/permission.js`):
- Routes are generated dynamically based on user roles from `user/getInfo`
- Routes defined in `src/router/index.js` with `constantRoutes` (public) and `asyncRoutes` (protected)
- Route `meta.roles` array controls access; empty array means no permission required
- Uses `router.beforeEach` navigation guard to check authentication

**API Layer** (`src/utils/request.js`):
- Custom axios instance with baseURL from `process.env.VUE_APP_BASE_API`
- Automatically adds `Authorization: Bearer <token>` header from cookies
- Response code `20000` indicates success; `50008/50012/50014` indicates token issues
- Failed requests redirect to login on specific error codes

**Vuex Store** (`src/store/index.js`):
- Modules are auto-imported from `modules/` directory using `require.context`
- Access state via `store.getters.`<module>`/`<property>
- Dispatch actions via `store.dispatch('`<module>`/`<action>`')`

**Mock Data**:
- Mock server enabled in production only (`mock/index.js`)
- Uses Mock.js for simulating API responses
- Disable by removing mockXHR() call in `src/main.js`

### Business Modules

Custom business modules in `src/views/`:
- `flat/` - Installation management with big screen dashboards
- `technician/` - Technician management
- `complaint/` - Complaint handling
- `installation/` - Work order management

### Element UI Integration

- Element UI plugin registered globally in `src/main.js`
- Size can be set via cookies (`size` key) or defaults to 'medium'
- Custom theme variables in `src/styles/element-variables.scss`

## Code Conventions

- Use `@/` alias for `src/` (configured in webpack/vue-cli)
- Views use lazy-loaded components: `component: () => import('@/views/...')`
- Route names must match component names for `<keep-alive>` to work
- Use `plop` templates (`npm run new`) for consistent component/file generation