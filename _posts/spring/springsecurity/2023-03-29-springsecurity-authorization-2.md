---
title: "인가 프로세스 DB 연동 (1)"
excerpt: "url 방식 - FilterInvocationSecurityMetadataSource"

categories:
  - Spring Security
tags:
  - [tag1, tag2]

permalink: /spring-security/authorization-2/

toc: true
toc_sticky: true

date: 2023-03-29
last_modified_at: 2023-03-29
---

## [DB 연동] Url 권한 체크
### FilterInvocationSecurityMetadataSource

<img src="/assets/images/posts_img/springsecurity/url.png">

> 최상위 인터페이스 SecurityMetadataSource 를 상속받은 UrlFilterInvocationSecurityMetadataSource 클래스를 만들어서 getAttributes 메소드를 구현   

<img src="/assets/images/posts_img/springsecurity/url_flow.png">

1. 사용자가 uri(리소스)로 요청   
2. 인가를 처리하는 FilterSecurityInterceptor 가 요청을 받음      
3. 인가를 처리하기 위해 권한을 조회   
4. FilterInvocationSecurityMetadataSource 에서 Map에 저장된 권한 정보를 추출   
5. 리소스에 해당하는 권한을 가지고 있으면 AccessDecisionManager 에 전달   
6. 리소스에 해당하는 권한이 없으면 권한 없음으로 처리

> getAttributes 메소드 구현은 DefaultFilterInvocationSecurityMetadataSource 클래스의 메소드를 참고하면 된다. 

1) UrlFilterInvocationSecurityMetadataSource 클래스 구현   
2) SecurityConfig 에 FilterSecurityInterceptor Filter 추가 후   UrlFilterInvocationSecurityMetadataSource 클래스를 설정

```java
@Bean
public FilterSecurityInterceptor customFilterSecurityInterceptor() throws Exception {

    FilterSecurityInterceptor filterSecurityInterceptor = new FilterSecurityInterceptor();
    // 설정한 클래스 추가
    filterSecurityInterceptor.setSecurityMetadataSource(urlFilterInvocationSecurityMetadataSource());
    // AccessDecisionManager 접근 결정 관리자
    // 구현체 3가지 타입 중 affirmativeBased 사용
    filterSecurityInterceptor.setAccessDecisionManager(affirmativeBased());
    // 인증 매니저 사용
    filterSecurityInterceptor.setAuthenticationManager(authenticationManagerBean());
    return filterSecurityInterceptor;
}
```

#### AccessDecisionManager 결정을 내리는 인터페이스로, 구현체 3가지를 기본으로 제공한다.

- AffirmativeBased : 여러 Voter 중에 한명이라도 허용하면 허용, 기본전략
- ConsensusBased : 다수결
- UnanimousBased : 만장일치

3) 빈 생성

```java
@Bean
public FilterInvocationSecurityMetadataSource urlFilterInvocationSecurityMetadataSource() {
    return new UrlFilterInvocationSecurityMetadataSource();
}

private AccessDecisionManager affirmativeBased() {
    AffirmativeBased affirmativeBased = new AffirmativeBased(getAccessDecistionVoters());
    return affirmativeBased;
}

private List<AccessDecisionVoter<?>> getAccessDecistionVoters() {
    return Arrays.asList(new RoleVoter());
}
```

4) CustomFilterSecurityInterceptor 필터를 사용하기 위해 FilterSecurityInterceptor 필터앞에 실행되도록 함

```java
.and()
    .addFilterBefore(customFilterSecurityInterceptor(), FilterSecurityInterceptor.class)
```

5) FilterChainProxy 클래스에서 만든 필터를 사용하는지 디버깅

```java
// break point 확인
nextFilter.doFilter(request, response, this);
```

6) 만든 필터 확인   
<img src="/assets/images/posts_img/springsecurity/custom_filter_interceptor.png">

7) AbstractSecurityInterceptor 클래스에서 만든 필터의 getAttributes 메소드 사용 확인   
<img src="/assets/images/posts_img/springsecurity/custom_getAttribute.png">
8) 만든 FilterSecurityInterceptor 가 기존의 FilterSecurityInterceptor 앞에서 인가를 마치고 기존의 FilterSecurityInterceptor 를 타도 앞에서 처리를 했기때문에 기존의 필터는 인가를 처리를 하지 않는다. 즉 두번 인가 처리하지 않는다.

```java
// 해당 로직으로 인해 두번 처리하지 않고 그 다음 필터로 넘어간다.
if (fi.getRequest() != null && fi.getRequest().getAttribute("__spring_security_filterSecurityInterceptor_filterApplied") != null && this.observeOncePerRequest) {
   fi.getChain().doFilter(fi.getRequest(), fi.getResponse());
} else {
```

9) 리소스와 권한을 하드코딩하여 임의로 세팅해서 테스트 해보면 (로그인x)

```java
// getAttributes 메소드에
requestMap.put(new AntPathRequestMatcher("/mypage"), Arrays.asList(new SecurityConfig("ROLE_USER")));

// AbstractSecurityInterceptor 클래스에서 AccessDecisionManager 에게 전달
this.accessDecisionManager.decide(authenticated, object, attributes);
```

+ authenticated
  + anonymousUser (로그인 하지 않았기 때문에)
+ object
  + FilterInvocation: URL: /mypage
+ attributes
  + ROLE_USER

10) 인증되지 않았기 때문에 로그인 페이지로 이동

