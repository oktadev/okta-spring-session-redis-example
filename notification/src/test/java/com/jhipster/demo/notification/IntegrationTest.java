package com.jhipster.demo.notification;

import com.jhipster.demo.notification.MongoDbTestContainerExtension;
import com.jhipster.demo.notification.NotificationApp;
import com.jhipster.demo.notification.config.TestSecurityConfiguration;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { NotificationApp.class, TestSecurityConfiguration.class })
@ExtendWith(MongoDbTestContainerExtension.class)
public @interface IntegrationTest {
}
