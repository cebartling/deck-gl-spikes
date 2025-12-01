Feature: About Page
  As a user
  I want to visit the about page
  So that I can learn more about the project

  Scenario: Display about page content
    Given I am on the about page
    Then I should see the heading "About"
    And I should see the project description
    And I should see a link to the Home page

  Scenario: Navigate to Home page
    Given I am on the about page
    When I click the "Go to Home" link
    Then I should be on the Home page
