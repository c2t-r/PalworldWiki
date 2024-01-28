const dir = "https://raw.githubusercontent.com/c2t-r/PalworldData/main/"

async function fetchJson(path) {
    const url = dir + path
    const response = await fetch(url, {
        method: "GET"
    });

    if (response.ok) {
        return await response.json();
    } else {
        return console.error(`[ERROR] GET ${response.url} : ${response.status}`);
    }
}

function getPalName(palTextName, id) {
    if (id && id.includes("BOSS_")) {
        id = id.replaceAll("BOSS_", "");
        const palName = "BOSS " + (palTextName[`PAL_NAME_${id}`]?.TextData.LocalizedString ?? "???");
        return palName
    } else if (id && id.includes("GYM_")) {
        id = id.replaceAll("GYM_", "");
        const palName = "GYM " + (palTextName[`PAL_NAME_${id}`]?.TextData.LocalizedString ?? "???");
        return palName
    } else {
        const palName = palTextName[`PAL_NAME_${id}`]?.TextData.LocalizedString;
        return palName
    }
}

let palDataMain, palTextName, palTextShortDesc, palTextLongDesc, palTextSkillName, palTextSkillDesc, palDataIcon;

async function palChanged() {
    const n = document.getElementById("search_box").selectedIndex;
    let palId = document.querySelectorAll("#search_box > option")[n].getAttribute("data-id");
    window.location.hash = palId;

    changePal(palId)
}

async function changePal(palId) {
    console.log(palId);
    const pal = palDataMain[palId];

    const fileNmae = palDataIcon[palId.replace("BOSS_", "").replace("GYM_", "")]?.Icon.AssetPathName.split("Texture/").slice(-1)[0].split(".")[0] ?? "Logo_Splash/T_Palworld_Logo_Small_White"
    const imageUrl = `../../image/${fileNmae}.png`;
    document.querySelector(".face").style.backgroundImage = `url("${imageUrl}")`;
    document.querySelector(".face > span").style.visibility = "visible";
    document.querySelector(".face > span > #pal_name").innerText = getPalName(palTextName, pal?.BPClass) ?? "???";

    if (pal?.ZukanIndex > 0) document.querySelector("#status_type_index > .status_value").innerText = pal?.ZukanIndex ?? "???";
    else document.querySelector("#status_type_index > .status_value").innerText = "図鑑外";
    document.querySelector("#status_type_hp > .status_value").innerText = pal?.HP ?? "???";
    document.querySelector("#status_type_def > .status_value").innerText = pal?.Defense ?? "???";
    document.querySelector("#status_type_matk > .status_value").innerText = pal?.MeleeAttack ?? "???";
    document.querySelector("#status_type_satk > .status_value").innerText = pal?.ShotAttack ?? "???";

    document.querySelector("#status_type_food > .status_value").innerText = pal?.FoodAmount ?? "???";
    document.querySelector("#status_type_work_speed > .status_value").innerText = pal?.CraftSpeed ?? "???";
    document.querySelector("#status_type_rarity > .status_value").innerText = pal?.Rarity ?? "???";
    document.querySelector("#status_type_price > .status_value").innerText = pal?.Price ?? "???";

    document.getElementById("sub_ability_0_value").innerText = pal?.WorkSuitability_EmitFlame ?? "???";
    document.getElementById("sub_ability_1_value").innerText = pal?.WorkSuitability_Watering ?? "???";
    document.getElementById("sub_ability_2_value").innerText = pal?.WorkSuitability_Seeding ?? "???";
    document.getElementById("sub_ability_3_value").innerText = pal?.WorkSuitability_GenerateElectricity ?? "???";
    document.getElementById("sub_ability_4_value").innerText = pal?.WorkSuitability_Handcraft ?? "???";
    document.getElementById("sub_ability_5_value").innerText = pal?.WorkSuitability_Collection ?? "???";
    document.getElementById("sub_ability_6_value").innerText = pal?.WorkSuitability_Deforest ?? "???";
    document.getElementById("sub_ability_7_value").innerText = pal?.WorkSuitability_Mining ?? "???";
    document.getElementById("sub_ability_8_value").innerText = pal?.WorkSuitability_OilExtraction ?? "???";
    document.getElementById("sub_ability_9_value").innerText = pal?.WorkSuitability_ProductMedicine ?? "???";
    document.getElementById("sub_ability_10_value").innerText = pal?.WorkSuitability_Cool ?? "???";
    document.getElementById("sub_ability_11_value").innerText = pal?.WorkSuitability_Transport ?? "???";
    document.getElementById("sub_ability_12_value").innerText = pal?.WorkSuitability_MonsterFarm ?? "???";
}

window.onload = async () => {
    palDataMain = await fetchJson("DataTable/Character/PalMonsterParameter.json");
    palTextName = await fetchJson("DataTable/Text/PalNameText.json");
    palTextShortDesc = await fetchJson("DataTable/Text/PalFirstActivatedInfoText.json");
    palTextLongDesc = await fetchJson("DataTable/Text/PalLongDescriptionText.json");
    palTextSkillName = await fetchJson("DataTable/Text/SkillNameText.json");
    palTextSkillDesc = await fetchJson("DataTable/Text/SkillDescText.json");
    palDataIcon = await fetchJson("DataTable/Character/PalCharacterIconDataTable.json");

    let select = document.getElementById("search_box");
    const parsed = Object.values(palDataMain).map((pal) => ({
        BPClass: pal?.BPClass,
        palName: getPalName(palTextName, pal?.BPClass) ?? pal?.BPClass,
    })).filter(n => n !== undefined).sort((a, b) => {
        if (a.palName > b.palName) {
            return 1
        } else {
            return -1
        }
    });

    for (const pal of parsed.sort()) {
        const option = document.createElement("option");
        const text = document.createTextNode(pal?.palName);
        option.value = pal?.palName;
        option.dataset.id = pal?.BPClass;
        option.appendChild(text);
        select.appendChild(option);
    }

    if (window.location.hash) {
        const id = window.location.hash.substring(1)
        changePal(id);
        document.querySelector(`[data-id="${id}"]`).selected = true;
    }
}

document.getElementById("search_box").addEventListener('change', palChanged);
