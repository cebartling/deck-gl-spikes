Feature: Earthquake Map Visualization
  As a user
  I want to see an interactive map
  So that I can view earthquake data with geographic context

  Scenario: Display map with base layer
    Given I am on the home page
    Then I should see the map container
    And I should see the MapLibre canvas rendering
