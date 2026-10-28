package fr.alternancehunter;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
class ScoreMathTest{
 @Test void cosineIdentical(){double[] a={1,2,3};double dot=0,n=0;for(double x:a){dot+=x*x;n+=x*x;}assertEquals(1.0,dot/n,1e-10);}
 @Test void invalidEmailPattern(){assertTrue("test@example.org".matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"));}
}
