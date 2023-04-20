---
title: "인가 프로세스 DB 연동 (2)"
excerpt: "url 방식 - FilterInvocationSecurityMetadataSource"

categories:
  - Spring Security
tags:
  - [tag1, tag2]

permalink: /springsecurity/authorization/3/

toc: true
toc_sticky: true

date: 2023-04-01
last_modified_at: 2023-04-01
---

## [DB 연동] Url 권한 체크
### 1. UrlResourcesMapFactoryBean
>DB로 부터 얻은 권한/자원 정보를 ResourceMap 빈으로 생성해서 이전 시간에 만든 필터인 UrlFilterInvocationSecurityMetadataSource 에 전달

+ UrlResourcesMapFactoryBean 클래스를 생성하고

```java
public class UrlResourcesMapFactoryBean implements FactoryBean<LinkedHashMap<RequestMatcher, List<ConfigAttribute>>> {

    private SecurityResourceService securityResourceService;
    private LinkedHashMap<RequestMatcher, List<ConfigAttribute resourceMap;

    public void setSecurityResourceService(SecurityResourceService securityResourceService) {
        this.securityResourceService = securityResourceService;
    }

    @Override
    public LinkedHashMap<RequestMatcher, List<ConfigAttribute>> getObject() throws Exception {

        if (resourceMap == null) {
            init();
        }

        return resourceMap;
    }

    private void init() {
        resourceMap = securityResourceService.getResourceList();
    }

    @Override
    public Class<?> getObjectType() {
        return LinkedHashMap.class;
    }

    @Override
    public boolean isSingleton() {
        return FactoryBean.super.isSingleton();
    }
}
```

+ resourceMap에 권한/자원 정보를 조회할 SecurityResourceService 클래스 생성

```java
public class SecurityResourceService {

    private ResourcesRepository resourcesRepository;

    public void setResourcesRepository(ResourcesRepository resourcesRepository) {
        this.resourcesRepository = resourcesRepository;
    }

    public LinkedHashMap<RequestMatcher, List<ConfigAttribute>> getResourceList() {
        LinkedHashMap<RequestMatcher, List<ConfigAttribute>> result = new LinkedHashMap<>();

        // 리소스 - 권한 목록 조회
        List<Resources> resourcesList = resourcesRepository.findAllResources();

        resourcesList.forEach(re -> {
            List<ConfigAttribute> configAttributeList = new ArrayList<>();
            re.getRoleSet().forEach(role -> {
                configAttributeList.add(new SecurityConfig(role.getRoleName()));
            });
            result.put(new AntPathRequestMatcher(re.getResourceName()), configAttributeList);
        });

        return result;
    }
}
```

+ 빈을 생성하는 공통 Config 클래스 생성. SecurityResourceService 클래스 빈 등록

```java
@Configuration
public class AppConfig {

    @Bean
    public SecurityResourceService securityResourceService(ResourcesRepository resourcesRepository) {
        SecurityResourceService securityResourceService = new SecurityResourceService(resourcesRepository);
        return securityResourceService;
    }
}
```

+ SecuriyConfig 파일에서 DB로 부터 얻은 권한/자원 정보를 담은 ResourceMap 를 UrlFilterInvocationSecurityMetadataSource 에 전달

```java
    @Bean
    public FilterInvocationSecurityMetadataSource urlFilterInvocationSecurityMetadataSource() throws Exception {
        return new UrlFilterInvocationSecurityMetadataSource(urlResourcesMapFactortyBean().getObject());
    }

    private UrlResourcesMapFactoryBean urlResourcesMapFactortyBean() {

        UrlResourcesMapFactoryBean urlResourcesMapFactoryBean = new UrlResourcesMapFactoryBean();
        urlResourcesMapFactoryBean.setSecurityResourceService(securityResourceService);
        return urlResourcesMapFactoryBean;
    }
```

### 2. 테스트
1. 루트로 접속 (미인증)
   + AbstractSecurityInterceptor 클래스의 beforeInvocation 메소드에서 attributes 가 null 이기 때문에 인가처리하지 않고 넘어감   
2. 마이페이지 접속 (미인증)
   + DB 조회해온 리소스가 존재하기 때문에 체크를 하지만 인증을 받지 않았기 때문에 로그인 페이지로 이동
3. 마이페이지 접속 (admin 로그인 완료)
   + Authentication 인증 객체에 있는 권한이 마이페이지 리소스 접속 가능 권한인 ROLE_MANAGER 이 포함되므로 접속 가능
4. 마이페이지 접속 (user 로그인 완료)
   + Authentication 인증 객체에 있는 권한이 마이페이지 리소스 접속 가능 권한인 ROLE_MANAGER 이 포함되지 않으므로 접속 불가능   

