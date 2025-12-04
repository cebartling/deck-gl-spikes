Feature: Header Navigation
  As a user
  I want to see a persistent header on all pages
  So that I can easily navigate between different sections of the application

  Scenario: Header is visible on home page
    Given I am on the home page
    Then I should see the header
    And the header should contain the site title
    And the header should have navigation links

  Scenario: Header is visible on earthquakes page
    Given I am on the earthquakes page
    Then I should see the header
    And the header should contain the site title
    And the header should have navigation links

  Scenario: Header is visible on about page
    Given I am on the about page
    Then I should see the header
    And the header should contain the site title
    And the header should have navigation links

  Scenario: Navigate to home using header
    Given I am on the about page
    When I click the header "Home" link
    Then I should be on the Home page

  Scenario: Navigate to earthquakes using header
    Given I am on the home page
    When I click the header "Earthquakes" link
    Then I should be on the earthquakes page

  Scenario: Navigate to about using header
    Given I am on the home page
    When I click the header "About" link
    Then I should be on the About page
