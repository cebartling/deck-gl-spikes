Feature: Earthquake Map Visualization
  As a user
  I want to see an interactive map
  So that I can view earthquake data with geographic context

  Scenario: Display map with base layer
    Given I am on the earthquakes page
    Then I should see the map container
    And I should see the MapLibre canvas rendering

  Scenario: Display earthquake points on map
    Given I am on the earthquakes page
    And earthquake data has loaded
    Then I should see earthquake points rendered on the map

  Scenario: Show loading indicator while fetching data
    Given I am on the earthquakes page
    Then I should see the loading indicator
    And the loading indicator should disappear when data loads

  Scenario: Map is interactive
    Given I am on the earthquakes page
    And earthquake data has loaded
    When I zoom in on the map
    Then the map zoom level should increase

  Scenario: Points are positioned correctly on the map
    Given I am on the earthquakes page
    And earthquake data has loaded
    Then I should see earthquake points rendered on the map
    And the map should render without coordinate errors

  Scenario: Point sizes reflect magnitude
    Given I am on the earthquakes page
    And earthquake data has loaded
    Then the size legend should be visible

  Scenario: Pan the map
    Given I am on the earthquakes page
    And earthquake data has loaded
    When I click and drag on the map
    Then the map should pan in the direction of the drag
    And earthquake points should maintain their geographic positions

  Scenario: Zoom the map with controls
    Given I am on the earthquakes page
    And earthquake data has loaded
    Then I should see the zoom controls
    When I click the zoom in button
    Then the map should zoom in
    When I click the zoom out button
    Then the map should zoom out

  Scenario: Reset map view
    Given I am on the earthquakes page
    And earthquake data has loaded
    When I zoom in on the map
    And I click the reset view button
    Then the map should return to the initial view

  Scenario: Points maintain positions during zoom
    Given I am on the earthquakes page
    And earthquake data has loaded
    When I zoom in on the map
    Then earthquake points should remain at their geographic locations
    When I zoom out on the map
    Then earthquake points should remain at their geographic locations

  Scenario: Tooltip component is rendered for earthquake points
    Given I am on the earthquakes page
    And earthquake data has loaded
    Then the earthquake layer should be pickable for tooltip display

  Scenario: Date range selector is visible
    Given I am on the earthquakes page
    And earthquake data has loaded
    Then I should see the date range selector
    And I should see the time period presets

  Scenario: Filter earthquakes using 24 hour preset
    Given I am on the earthquakes page
    And earthquake data has loaded
    When I click the "24h" preset button
    Then the earthquake count should update
    And the filter indicator should show active state

  Scenario: Filter earthquakes using 7 day preset
    Given I am on the earthquakes page
    And earthquake data has loaded
    When I click the "7d" preset button
    Then the earthquake count should update
    And the filter indicator should show active state

  Scenario: Clear filter using All preset
    Given I am on the earthquakes page
    And earthquake data has loaded
    When I click the "7d" preset button
    And I click the "All" preset button
    Then the earthquake count should show all earthquakes
    And the filter indicator should not show active state

  Scenario: Earthquake stats display updates with filter
    Given I am on the earthquakes page
    And earthquake data has loaded
    Then I should see the earthquake stats panel
    When I click the "7d" preset button
    Then the stats should indicate filtering is active
