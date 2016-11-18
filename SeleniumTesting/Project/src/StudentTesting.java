import org.junit.*;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * Created by Tor on 16.11.2016.
 */

public class StudentTesting {
    private static ChromeDriver driver;
    private static String brukernavn = "tep002@student.uib.no";
    private static String passord = "123";
    private static WebElement element;
    private static Connection db;


    //Setup for the driver and db connection, also wipes the person, course, enrolled_in, is_in_seminar_group and seminargroup tables + adds some data to test on.
    @BeforeClass
    public static void openBrowser() throws SQLException, ClassNotFoundException {
        System.setProperty("webdriver.chrome.driver", "chromedriver.exe");
        driver = new ChromeDriver();
        Class.forName("com.mysql.jdbc.Driver");
        db = DriverManager.getConnection("jdbc:mysql://localhost/testAtdb", "root", "");
        Statement stmt = db.createStatement();
        stmt.executeUpdate("DELETE FROM `person`");
        stmt.executeUpdate("DELETE FROM `course`");
        stmt.executeUpdate("DELETE FROM `enrolled_in`");
        stmt.executeUpdate("DELETE FROM `seminargroup`");
        stmt.executeUpdate("DELETE FROM `is_in_seminar_group`");
        stmt.executeUpdate("INSERT INTO `seminargroup` (`semGrID`,`courseID`,`name`)VALUES ('1', 'INFO100','INFO100 - Gruppe 1')");
        stmt.executeUpdate("INSERT INTO `seminargroup` (`semGrID`,`courseID`,`name`)VALUES ('2', 'INFO100','INFO100 - Gruppe 2')");
        stmt.executeUpdate("INSERT INTO `course` (`courseID`, `name`, `semester`, `attendance`, `plannedSeminars`) VALUES ('INFO100', 'Introduksjon til programmering', 'Haust', '80','23')");
        registerNewUser("Tor", "Hagland", brukernavn, "tep002", passord);
    }

    @Test
    public void testValidUserLogin(){
        logIn(brukernavn, passord);
        try{
            element = driver.findElement(By.cssSelector("a[href='/logout']"));
        }catch(Exception e){}
        Assert.assertNotNull(element);
        logOut();
    }

    @Test
    public void testInvalidUserLogin(){
        logIn("asdf", "adwaefgsa");
        try{
            element = driver.findElement(By.cssSelector("a[href='/logout']"));
        }catch(Exception e){}
        Assert.assertNull(element);
    }

    @Test
    public void testLogOut(){
        logIn(brukernavn, passord);
        logOut();
        try {
            element = driver.findElement(By.cssSelector("a[href='/login']"));
        }catch(Exception e){}
        Assert.assertNotNull(element);
    }

    @Test
    public void testValidChangeLastName(){
        logIn(brukernavn, passord);
        WebElement lastName = driver.findElement(By.cssSelector("input[id='lastName']"));
        String currentLastName = lastName.getAttribute("value");
        lastName.clear();
        lastName.sendKeys(currentLastName + "EKSTRA");
        WebElement updt = driver.findElement(By.cssSelector("button[id='updateProfileBtn']"));
        updt.click();
        driver.get("localhost:3000/student/dashboard");
        WebElement lastName2 = driver.findElement(By.cssSelector("input[id='lastName']"));
        String newLastName = lastName2.getAttribute("value");
        Assert.assertEquals(currentLastName + "EKSTRA",newLastName);
        logOut();
    }

    @Test
    public void testValidChangeFirstName(){
        logIn(brukernavn, passord);
        WebElement firstName = driver.findElement(By.cssSelector("input[id='firstName']"));
        String currentLastName = firstName.getAttribute("value");
        firstName.clear();
        firstName.sendKeys(currentLastName + "EKSTRA");
        WebElement updt = driver.findElement(By.cssSelector("button[id='updateProfileBtn']"));
        updt.click();
        driver.get("localhost:3000/student/dashboard");
        WebElement firstName2 = driver.findElement(By.cssSelector("input[id='firstName']"));
        String newLastName = firstName2.getAttribute("value");
        Assert.assertEquals(currentLastName + "EKSTRA", newLastName);
        logOut();

    }

    @Test
    public void testInvalidChangeLastName(){
        logIn(brukernavn, passord);
        WebElement lastName = driver.findElement(By.cssSelector("input[id='lastName']"));
        String currentLastName = lastName.getAttribute("value");
        lastName.clear();
        String newName = "";
        // For-loop runs 33 times as 32 is the largest name you can have.
        for(int i = 0; i<33;i++){
            newName += "i";
        }
        lastName.sendKeys(newName);
        WebElement updt = driver.findElement(By.cssSelector("button[id='updateProfileBtn']"));
        updt.click();
        driver.get("localhost:3000/student/dashboard");
        WebElement lastName2 = driver.findElement(By.cssSelector("input[id='lastName']"));
        String newLastName = lastName2.getAttribute("value");
        Assert.assertEquals(currentLastName,newLastName);
        logOut();
    }

    @Test
    public void tesInvalidChangeFirstName(){
        logIn(brukernavn, passord);
        WebElement firstName = driver.findElement(By.cssSelector("input[id='firstName']"));
        String currentLastName = firstName.getAttribute("value");
        firstName.clear();
        String newName = "";
        // For-loop runs 33 times as 32 is the largest name you can have.
        for(int i = 0; i<33;i++){
            newName += "i";
        }
        firstName.sendKeys(newName);
        WebElement updt = driver.findElement(By.cssSelector("button[id='updateProfileBtn']"));
        updt.click();
        driver.get("localhost:3000/student/dashboard");
        WebElement firstName2 = driver.findElement(By.cssSelector("input[id='firstName']"));
        String newLastName = firstName2.getAttribute("value");
        Assert.assertEquals(currentLastName, newLastName);
        logOut();

    }

    @Test
    public void testChangeEmail(){
        String newEmail = "epost@epost.com";
        logIn(brukernavn, passord);
        WebElement email = driver.findElement(By.cssSelector("input[id='email']"));
        email.clear();
        email.sendKeys(newEmail);
        WebElement updt = driver.findElement(By.cssSelector("button[id='updateProfileBtn']"));
        updt.click();
        logOut();
        logIn(newEmail, passord);
        try{
            element = driver.findElement(By.cssSelector("a[href='/logout']"));
        }catch(Exception e){}
        Assert.assertNotNull(element);
        brukernavn = newEmail;
        logOut();

    }

    @Test
    public void testRegisterNewUser(){
        registerNewUser("Ola", "Nordmann", "123@123.com", "test123", "123");
        logIn("123@123.com", "123");
        try{
            element = driver.findElement(By.cssSelector("a[href='/logout']"));
            logOut();
        }catch(Exception e){}
        Assert.assertNotNull(element);
    }

    @Test
    public void testSignUpForSeminar(){
        searchForCourse("INFO100");

        WebElement course = driver.findElement(By.cssSelector("tr[data-courseid='INFO100']"));
        course.click();
        WebElement signup = driver.findElement(By.cssSelector("a[data-seminarkey='1']"));
        signup.click();
        driver.get("localhost:3000/student/dashboard");

        try {
            element = driver.findElement(By.cssSelector("a[href='/student/removeSeminar/1']"));
        } catch (Exception e) {}

        Assert.assertNotNull(element);
        logOut();
    }

    @Test
    public void testSearchForCourse(){
        String course = "INFO100";
        searchForCourse(course);
        try {
            element = driver.findElement(By.cssSelector("tr[data-courseid='" + course + "']"));
        } catch (Exception e) {
            e.printStackTrace();
        }
        Assert.assertNotNull(element);
        logOut();

    }

    private static void logIn(String usrname, String pw){
        driver.get("localhost:3000");
        WebElement login = driver.findElement(By.cssSelector("a[href='/login']"));
        login.click();
        WebElement username = driver.findElement(By.cssSelector("input[type='email']"));
        username.sendKeys(usrname);
        WebElement password = driver.findElement(By.cssSelector("input[type='password']"));
        password.sendKeys(pw);
        WebElement loginbtn = driver.findElement(By.cssSelector("button[id='loginButton']"));
        loginbtn.click();
    }

    private static void logOut(){
        WebElement logout = driver.findElement(By.cssSelector("a[href='/logout']"));
        logout.click();
    }

    private static void registerNewUser(String fName, String lName, String email, String uName, String pw){
        driver.get("localhost:3000");
        WebElement regBtn = driver.findElement(By.cssSelector("a[href='/register']"));
        regBtn.click();
        WebElement firstName = driver.findElement(By.cssSelector("input[id='firstName']"));
        WebElement lastName = driver.findElement(By.cssSelector("input[id='lastName']"));
        WebElement mail = driver.findElement(By.cssSelector("input[id='email']"));
        WebElement studID = driver.findElement(By.cssSelector("input[id='studentRegID']"));
        WebElement password = driver.findElement(By.cssSelector("input[id='password']"));
        WebElement confirmPW = driver.findElement(By.cssSelector("input[id='confirmPassword']"));

        firstName.sendKeys(fName);
        lastName.sendKeys(lName);
        mail.sendKeys(email);
        studID.sendKeys(uName);
        password.sendKeys(pw);
        confirmPW.sendKeys(pw);

        WebElement createBtn = driver.findElement(By.cssSelector("button[id='registerButton']"));
        createBtn.click();

    }

    private static void searchForCourse(String course){
        logIn(brukernavn, passord);
        WebElement search = driver.findElement(By.cssSelector("input[id='inputCourse']"));
        search.click();
        search.sendKeys(course);
    }

    @AfterClass
    public static void closeBrowser(){
        driver.quit();
    }

}
