Feature: About Page
  As a user
  I want to visit the about page
  So that I can learn more about the project

  Scenario: Display about page content
    Given I am on the about page
    Then I should see the heading "About"
    And I should see the project description
