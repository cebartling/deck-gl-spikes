Feature: Home Page
  As a user
  I want to visit the home page
  So that I can navigate to different parts of the application

  Scenario: Display home page content
    Given I am on the home page
    Then I should see the heading "deck.gl Spike Project"
    And I should see the project description

  Scenario: Navigate to earthquakes page
    Given I am on the home page
    When I click the "Earthquake Map Visualization" link
    Then I should be on the earthquakes page
    And I should see the map container

  Scenario: Navigate to about page from home
    Given I am on the home page
    When I click the "About" link
    Then I should be on the About page
