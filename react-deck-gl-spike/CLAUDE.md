# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript spike project for experimenting with deck.gl visualization library. It uses Vite (via rolldown-vite) as the build tool.

## Commands

- `npm run dev` - Start development server with HMR
- `npm run build` - Type-check with TypeScript then build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Tech Stack

- React 19 with TypeScript
- Vite (using rolldown-vite for bundling)
- ESLint with TypeScript and React hooks plugins
- Strict TypeScript configuration (strict mode, no unused locals/parameters)

## Architecture

- `src/main.tsx` - Application entry point, renders App in StrictMode
- `src/App.tsx` - Root component
- `vite.config.ts` - Vite configuration with React plugin
- `eslint.config.js` - Flat ESLint config targeting TypeScript/React
