Feature: Home Page
  As a user
  I want to visit the home page
  So that I can learn about the project and navigate to the earthquake map

  Scenario: Display home page content
    Given I am on the home page
    Then I should see the heading "deck.gl Spike Project"
    And I should see the project description

  Scenario: Navigate to earthquakes page using call-to-action
    Given I am on the home page
    When I click the "View Earthquake Map" link
    Then I should be on the earthquakes page
    And I should see the map container
