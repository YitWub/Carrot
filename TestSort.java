import java.time.LocalDateTime;
import java.util.*;

public class TestSort {
    public static void main(String[] args) {
        List<LocalDateTime> list = new ArrayList<>();
        list.add(LocalDateTime.now().minusDays(2)); // older
        list.add(LocalDateTime.now().minusDays(1)); // newer
        list.add(LocalDateTime.now()); // newest
        
        list.sort((r1, r2) -> r2.compareTo(r1));
        
        for (LocalDateTime dt : list) {
            System.out.println(dt);
        }
    }
}
