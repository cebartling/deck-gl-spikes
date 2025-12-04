Feature: Header Navigation
  As a user
  I want to see a persistent header on all pages
  So that I can easily navigate between different sections of the application

  Scenario: Header is visible on home page
    Given I am on the home page
    Then I should see the header
    And the header should contain the site title
    And the header should have navigation elements

  Scenario: Header is visible on earthquakes page
    Given I am on the earthquakes page
    Then I should see the header
    And the header should contain the site title
    And the header should have navigation elements

  Scenario: Header is visible on about page
    Given I am on the about page
    Then I should see the header
    And the header should contain the site title
    And the header should have navigation elements

  Scenario: Navigate to home using header
    Given I am on the about page
    When I click the header "Home" link
    Then I should be on the Home page

  Scenario: Navigate to earthquakes using Spikes dropdown
    Given I am on the home page
    When I click the "Spikes" dropdown button
    And I click the "Earthquakes" dropdown item
    Then I should be on the earthquakes page

  Scenario: Navigate to about using header
    Given I am on the home page
    When I click the header "About" link
    Then I should be on the About page

  Scenario: Spikes dropdown shows Earthquakes option
    Given I am on the home page
    When I click the "Spikes" dropdown button
    Then I should see the "Earthquakes" dropdown item

  Scenario: Spikes dropdown closes when clicking outside
    Given I am on the home page
    When I click the "Spikes" dropdown button
    Then the dropdown menu should be visible
    When I click outside the dropdown
    Then the dropdown menu should be hidden

  Scenario: Spikes dropdown closes after selecting an item
    Given I am on the home page
    When I click the "Spikes" dropdown button
    And I click the "Earthquakes" dropdown item
    Then the dropdown menu should be hidden
