import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.Wait;

/**
 * Created by Tor on 16.11.2016.
 */

public class TestClass {
    static WebDriver driver;
    static Wait<WebDriver> wait;
    private static String brukernavn = "tep002@student.uib.no";
    private static String passord = "123";

    public static void main(String[] args){
        System.setProperty("webdriver.chrome.driver", "chromedriver.exe");
        driver = new ChromeDriver();

        boolean faultyUser = testUserLogin("asdasdd", "asdaweasd");
        if (!faultyUser) System.out.println("Test passed. Could not log in user that doesn't exist.");
        else System.out.println("Test failed. Was able to log in user that doesn't exist.");

        boolean testLogOut = testLogOut();
        if (testLogOut) System.out.println("Test passed. Logged out successfully.");
        else System.out.println("Test failed. Could not log out.");

        boolean existUser = testUserLogin(brukernavn, passord);
        if (existUser) System.out.println("Test passed. Logged in successfully with existing user.");
        else System.out.println("Test failed. Could not log in.");

        boolean changeLastName = testChangeLastName();
        if (changeLastName) System.out.println("Test passed. Changed name successfully");
        else System.out.println("Test failed. Did not work to change last name.");

        boolean changeFirstName = testChangeFirsName();
        if(changeLastName) System.out.println("Test passed. Changed first name successfully");
        else System.out.println("Test failed. Could not change first name");

    }

    private static boolean testUserLogin(String navn, String pw){
        boolean logIn;
        logIn(navn, pw);
        if (driver.getCurrentUrl().equals("http://localhost:3000/student/dashboard")) {
            logIn = true;
            logOut();
        }else {
            logIn = false;
        }
        return logIn;
    }

    private static boolean testChangeLastName(){
        boolean changedLastName;
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
        if (newLastName.equals(currentLastName+"EKSTRA")) changedLastName = true;
        else changedLastName = false;

        return changedLastName;
    }

    private static boolean testChangeFirsName(){
        boolean changedFirstName;
        logIn(brukernavn, passord);
        WebElement firstName = driver.findElement(By.cssSelector("input[id='firstName']"));
        String currentLastName = firstName.getAttribute("value");
        firstName.clear();
        firstName.sendKeys(currentLastName + "EKSTRA");
        WebElement updt = driver.findElement(By.cssSelector("button[id='updateProfileBtn']"));
        updt.click();
        driver.get("localhost:3000/student/dashboard");
        WebElement firstName2 = driver.findElement(By.cssSelector("input[id='lastName']"));
        String newLastName = firstName2.getAttribute("value");
        if (newLastName.equals(currentLastName+"EKSTRA")) changedFirstName = true;
        else changedFirstName = false;

        return changedFirstName;
    }

    private static boolean testLogOut(){
        boolean loggedOut;
        logIn(brukernavn, passord);
        logOut();
        WebElement logIn = driver.findElement(By.cssSelector("a[href='/login']"));
        if (logIn.isDisplayed()){
            loggedOut = true;

        }else loggedOut = false;
        return loggedOut;

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
}
