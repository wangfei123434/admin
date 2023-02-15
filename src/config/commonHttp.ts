import http from "./http";

//三级联动(第一级)
export function friSubject(data: any) {
  return http.get("/rentserver/apartmentLeaseApply/listRootSubject2", data);
}

//三级联动
export function thrSubject(data: any) {
  return http.get(
    "/rentserver/apartmentLeaseApply/listSubjectByParentName2",
    data
  );
}

// 大学生租房信息保存
export function apartmentLeaseApplySave(data: any) {
  return http.post("/rentserver/apartmentLeaseApply/window/save", data);
}

// 高技能人才租房信息保存
export function apartmentLeaseApplySkillTalentSave(data: any) {
  return http.post(
    "/rentserver/apartmentLeaseApplySkillTalent/saveSkillTalent",
    data
  );
}
