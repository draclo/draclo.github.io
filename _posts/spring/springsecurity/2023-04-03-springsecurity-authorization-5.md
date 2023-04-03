---
title: "인증/권한 체크없이 리소스 접근"
excerpt: "url 방식 - PermitAllFilter"

categories:
  - Spring Security
tags:
  - [tag1, tag2]

permalink: /springsecurity/authorization-5/

toc: true
toc_sticky: true

date: 2023-04-03
last_modified_at: 2023-04-03
---

## PermitAllFilter 구현

<img src="/assets/images/posts_img/springsecurity/permit_all_filter_process.png">   

#### 기존 인가 프로세스
1. 사용자 요청이 오면
2. FilterSecurityInterceptor 가 받고
3. invoke 메서드에서 부모 클래스 AbstractSecurityInterceptor 에 인가처리를 맡김
4. 권한 목록인 List\<ConfigAttribute\> 가 null 이면 권한 심사 없이 바로 통과
5. null 이 아니면 AccessDecisionManager 가 권한 심사

#### PermitAllFilter 처리 프로세스
1. 사용자 요청이 오면
2. FilterSecurityInterceptor 를 상속받은 PermitAllFilter 가 받고
3. 인증/권한 심사가 필요없는 자원을 List\<RequestMatcher\> 에 등록
4. 요청 자원이 List\<RequestMatcher\> 에 매칭되면 null을 리턴하여 권한 심사 없이 바로 통과
5. 매칭되지 않으면 AbstractSecurityInterceptor 에 인가처리를 맡김
6. 권한 목록인 List\<ConfigAttribute\> 가 null 이면 권한 심사 없이 바로 통과
7. null 이 아니면 AccessDecisionManager 가 권한 심사


+ PermitAllFilter 클래스 생성   

```java
public class PermitAllFilter extends FilterSecurityInterceptor {
    private static final String FILTER_APPLIED = "__spring_security_filterSecurityInterceptor_filterApplied";
    private boolean observeOncePerRequest = true;

    // 인증/권한 리소스 체크 통과 목록
    private List<RequestMatcher> permitAllRequestMatchers = new ArrayList<>();

    // 체크 통과 리소스 목록을 담고
    public PermitAllFilter(String...permitAllResources) {
        for (String resource : permitAllResources) {
            permitAllRequestMatchers.add(new AntPathRequestMatcher(resource));
        }
    }

    // 해당 메소드에서 인증/권한 리소스 체크 통과 처리
    @Override
    protected InterceptorStatusToken beforeInvocation(Object object) {

        boolean permitAll = false;
        HttpServletRequest request = ((FilterInvocation) object).getRequest();

        for (RequestMatcher requestMatcher : permitAllRequestMatchers) {
            if (requestMatcher.matches(request)) {
                permitAll = true;
                break;
            }
        }

        // null을 리턴해주면 권한 심사 없이 바로 통과
        if (permitAll) {
            return null;
        }

        // null 이 아니면 권한 심사
        return super.beforeInvocation(object);
    }

    // FilterSecurityInterceptor 클래스에서 가져옴
    public void invoke(FilterInvocation fi) throws IOException, ServletException {
        if (fi.getRequest() != null && fi.getRequest().getAttribute("__spring_security_filterSecurityInterceptor_filterApplied") != null && this.observeOncePerRequest) {
            fi.getChain().doFilter(fi.getRequest(), fi.getResponse());
        } else {
            if (fi.getRequest() != null && this.observeOncePerRequest) {
                fi.getRequest().setAttribute("__spring_security_filterSecurityInterceptor_filterApplied", Boolean.TRUE);
            }

            // 부모 클래스 AbstractSecurityInterceptor beforeInvocation 메소드 호출이 아닌 beforeInvocation 오버라이드하여 호출
            InterceptorStatusToken token = beforeInvocation(fi);

            try {
                fi.getChain().doFilter(fi.getRequest(), fi.getResponse());
            } finally {
                super.finallyInvocation(token);
            }

            super.afterInvocation(token, (Object)null);
        }
    }
}
```

+ 다음으로 SecurityConfig 설정 클래스 수정

```java
    @Bean
    public PermitAllFilter customFilterSecurityInterceptor() throws Exception {
        // FilterSecurityInterceptor -> PermitAllFilter 로 변경
        PermitAllFilter permitAllFilter = new FilterSecurityInterceptor();
        //FilterSecurityInterceptor filterSecurityInterceptor = new FilterSecurityInterceptor();
        permitAllFilter.setSecurityMetadataSource(urlFilterInvocationSecurityMetadataSource());
        permitAllFilter.setAccessDecisionManager(affirmativeBased());
        permitAllFilter.setAuthenticationManager(authenticationManagerBean());
        return permitAllFilter;
    }
```




