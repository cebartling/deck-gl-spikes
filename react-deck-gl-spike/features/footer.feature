Feature: Footer
  As a user
  I want to see a persistent footer on all pages
  So that I can see copyright information

  Scenario: Footer is visible on home page
    Given I am on the home page
    Then I should see the footer
    And the footer should contain the copyright text

  Scenario: Footer is visible on earthquakes page
    Given I am on the earthquakes page
    Then I should see the footer
    And the footer should contain the copyright text

  Scenario: Footer is visible on about page
    Given I am on the about page
    Then I should see the footer
    And the footer should contain the copyright text
