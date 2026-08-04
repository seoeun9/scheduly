const { withGradleProperties } = require('@expo/config-plugins');

const GRADLE_JVM_ARGS = '-Xmx4096m -XX:MaxMetaspaceSize=1024m -Dfile.encoding=UTF-8';

module.exports = function withAndroidGradleMemory(config) {
  return withGradleProperties(config, (gradleConfig) => {
    const existingProperty = gradleConfig.modResults.find(
      (item) => item.type === 'property' && item.key === 'org.gradle.jvmargs'
    );

    if (existingProperty) {
      existingProperty.value = GRADLE_JVM_ARGS;
    } else {
      gradleConfig.modResults.push({
        type: 'property',
        key: 'org.gradle.jvmargs',
        value: GRADLE_JVM_ARGS,
      });
    }

    return gradleConfig;
  });
};
