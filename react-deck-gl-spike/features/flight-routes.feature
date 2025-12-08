Feature: Flight Routes Map Visualization
  As a user
  I want to see an interactive map of flight routes
  So that I can explore air travel connections between airports

  Scenario: Display map with base layer
    Given I am on the flight routes page
    Then I should see the flight map container
    And I should see the MapLibre canvas rendering

  Scenario: Display flight routes on map
    Given I am on the flight routes page
    And flight routes data has loaded
    Then I should see flight routes rendered on the map

  Scenario: Show loading indicator while fetching data
    Given I am on the flight routes page
    Then I should see the flight routes loading indicator
    And the flight routes loading indicator should disappear when data loads

  Scenario: Map is interactive
    Given I am on the flight routes page
    And flight routes data has loaded
    When I zoom in on the flight map
    Then the flight map zoom level should increase

  Scenario: Display flight routes legend
    Given I am on the flight routes page
    And flight routes data has loaded
    Then I should see the flight routes legend
    And the legend should show direction indicators
    And the legend should show frequency indicators

  Scenario: Display zoom controls
    Given I am on the flight routes page
    And flight routes data has loaded
    Then I should see the flight map zoom controls

  Scenario: Zoom the map with controls
    Given I am on the flight routes page
    And flight routes data has loaded
    When I click the flight map zoom in button
    Then the flight map should zoom in
    When I click the flight map zoom out button
    Then the flight map should zoom out

  Scenario: Reset map view
    Given I am on the flight routes page
    And flight routes data has loaded
    When I zoom in on the flight map
    And I click the flight map reset view button
    Then the flight map should return to the initial view

  Scenario: Pan the map
    Given I am on the flight routes page
    And flight routes data has loaded
    When I click and drag on the flight map
    Then the flight map should pan in the direction of the drag

  Scenario: Display airport filter
    Given I am on the flight routes page
    And flight routes data has loaded
    Then I should see the airport filter
    And the airport filter should have a search input

  Scenario: Display network summary stats
    Given I am on the flight routes page
    And flight routes data has loaded
    Then I should see the network summary stats
    And the stats should show routes count
    And the stats should show weekly flights count
    And the stats should show connected airports count

  Scenario: Filter routes by airport
    Given I am on the flight routes page
    And flight routes data has loaded
    When I focus on the airport search input
    Then I should see the airport dropdown
    And I should see the all airports option

  Scenario: Filter mode selector appears when airport is selected
    Given I am on the flight routes page
    And flight routes data has loaded
    When I select an airport from the dropdown
    Then I should see the filter mode selector
    And the filter mode selector should have route type options

  Scenario: Clear airport filter
    Given I am on the flight routes page
    And flight routes data has loaded
    When I select an airport from the dropdown
    And I click the clear filter button
    Then the network summary should be displayed
    And the filter mode selector should not be visible

  Scenario: Flight routes layer is pickable for tooltip display
    Given I am on the flight routes page
    And flight routes data has loaded
    Then the flight routes layer should be pickable for tooltip display
