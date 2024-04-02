import {MgtPerson, MgtPersonCardConfig} from "@microsoft/mgt";

MgtPerson.config.useContactApis = true;

MgtPersonCardConfig.useContactApis = false;
MgtPersonCardConfig.sections.profile = false;
MgtPersonCardConfig.sections.files = false;
MgtPersonCardConfig.sections.mailMessages = false;
MgtPersonCardConfig.sections.organization = {showWorksWith: false};
