import { readdir, readFile, writeFile } from "fs/promises";
import Moralis from "moralis";
import { FILES_FOLDER_PATH, IPFS_FOLDER_PATH, MORALIS_API_KEY, UPLOADED_FILE_PATH } from "./constants";
import path from "path";
import { toBase64 } from "js-base64";

async function upload() {
    await Moralis.start({
        apiKey: MORALIS_API_KEY,
    });

    const filenames = await readdir(FILES_FOLDER_PATH);

    const promises = filenames.map(async (filename) => {
        const file = await readFile(path.join(FILES_FOLDER_PATH, filename), "base64");
        return {
            path: path.join(IPFS_FOLDER_PATH, filename),
            content: file,
        };
    });

    const filesToUpload = await Promise.all(promises);

    const response = await Moralis.EvmApi.ipfs.uploadFolder({ abi: filesToUpload });

    await writeFile(UPLOADED_FILE_PATH, JSON.stringify(response, null, 4));
}

upload();
