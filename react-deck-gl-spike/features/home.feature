Feature: Home Page
  As a user
  I want to visit the home page
  So that I can see the earthquake map visualization

  Scenario: Display earthquake map on home page
    Given I am on the home page
    Then I should see the map container
    And I should see the MapLibre canvas rendering
