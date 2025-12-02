Feature: Earthquake Map Visualization
  As a user
  I want to see an interactive map
  So that I can view earthquake data with geographic context

  Scenario: Display map with base layer
    Given I am on the home page
    Then I should see the map container
    And I should see the MapLibre canvas rendering

  Scenario: Display earthquake points on map
    Given I am on the home page
    And earthquake data has loaded
    Then I should see earthquake points rendered on the map

  Scenario: Show loading indicator while fetching data
    Given I am on the home page
    Then I should see the loading indicator
    And the loading indicator should disappear when data loads

  Scenario: Map is interactive
    Given I am on the home page
    And earthquake data has loaded
    When I zoom in on the map
    Then the map zoom level should increase

  Scenario: Points are positioned correctly on the map
    Given I am on the home page
    And earthquake data has loaded
    Then I should see earthquake points rendered on the map
    And the map should render without coordinate errors
