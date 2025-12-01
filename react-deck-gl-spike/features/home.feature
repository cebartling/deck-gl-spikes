Feature: Home Page
  As a user
  I want to visit the home page
  So that I can see the main application content

  Scenario: Display home page content
    Given I am on the home page
    Then I should see the heading "Vite + React"
    And I should see a counter button with count "0"
    And I should see a link to the About page

  Scenario: Increment counter
    Given I am on the home page
    When I click the counter button
    Then I should see a counter button with count "1"

  Scenario: Navigate to About page
    Given I am on the home page
    When I click the "Go to About" link
    Then I should be on the About page
