---
title: "인가 처리 실시간 반영"
excerpt: "권한/리소스 정보가 변경되었을 경우 실시간으로 반영 처리"

categories:
  - Spring Security
tags:
  - [tag1, tag2]

permalink: /springsecurity/authorization-4/

toc: true
toc_sticky: true

date: 2023-04-02
last_modified_at: 2023-04-02
---

## [DB 연동] 인가 처리 실시간 반영
>DB 데이터의 권한/리소스 정보가 변경되었을 경우 변경된 권한/리소스로 실시간 반영하여 인가 처리한다.

+ UrlFilterInvocationSecurityMetadataSource 클래스에 변경된 권한/리소스를 실시간 반영할 reload 메서드 생성

```java
    public void reload() {
        LinkedHashMap<RequestMatcher, List<ConfigAttribute>> reloadedMap = securityResourceService.getResourceList();
        Iterator<Map.Entry<RequestMatcher, List<ConfigAttribute>>> iterator = reloadedMap.entrySet().iterator();

        requestMap.clear();

        while (iterator.hasNext()) {
            Map.Entry<RequestMatcher, List<ConfigAttribute>> entry = iterator.next();
            requestMap.put(entry.getKey(), entry.getValue());
        }
    }
```

+ ResourcesController 클래스에서 자원을 등록하는 API에 reload 해준다.

```java
   @Autowired
   private UrlFilterInvocationSecurityMetadataSource urlFilterInvocationSecurityMetadataSource;
   
   @PostMapping(value="/admin/resources")
   public String createResources(ResourcesDto resourcesDto) throws Exception {
   
        ModelMapper modelMapper = new ModelMapper();
        Role role = roleRepository.findByRoleName(resourcesDto.getRoleName());
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        Resources resources = modelMapper.map(resourcesDto, Resources.class);
        resources.setRoleSet(roles);
   
        resourcesService.createResources(resources);
        
        // 자원을 생성하고 리로드
        urlFilterInvocationSecurityMetadataSource.reload();
   
        return "redirect:/admin/resources";
   }
```

