# Feature: Flight Routes Visualization

## Overview

Display flight routes as arcs on an interactive map using deck.gl's ArcLayer, allowing users to explore air travel connections between airports.

## User Stories

### View Flight Routes Map

**As a** user
**I want to** see flight routes displayed as arcs on a map
**So that I** can visualize air travel connections between cities

#### Acceptance Criteria

- [ ] Map displays with a base layer showing geographic context
- [ ] Flight routes are rendered as curved arcs connecting airports
- [ ] Arc source and destination points are clearly indicated
- [ ] Arc color gradient shows directionality (source to destination)
- [ ] Arc width reflects flight frequency or passenger volume

### Interact with Map

**As a** user
**I want to** pan and zoom the map
**So that I** can explore different regions and route details

#### Acceptance Criteria

- [ ] Map supports click-and-drag panning
- [ ] Map supports scroll wheel zooming
- [ ] Arcs maintain positions and curvature during navigation

### View Route Details

**As a** user
**I want to** see details when hovering over a flight route
**So that I** can learn about specific connections

#### Acceptance Criteria

- [ ] Tooltip appears on arc hover
- [ ] Tooltip displays origin airport, destination airport, and route data
- [ ] Tooltip dismisses when cursor moves away
- [ ] Hovered arc is visually highlighted

### Filter by Airport

**As a** user
**I want to** filter routes by origin or destination airport
**So that I** can focus on specific hubs

#### Acceptance Criteria

- [ ] Airport selector is available
- [ ] Map updates to show only routes connected to selected airport
- [ ] Option to view all routes simultaneously

## Visual Requirements

- Arcs should use a gradient color scheme indicating direction
- Arc height should be proportional to route distance
- Arcs should be semi-transparent to show overlapping routes
- Map should default to a view showing major route concentrations
